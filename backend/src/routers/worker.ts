import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"
import { workerMiddleware } from "../middlewares/workermiddleware";
import { NextTask } from "../db";
import { createSubmissionInput } from "../types";


const prismaClient = new PrismaClient();
prismaClient.$transaction(
    async(prisma)=>{
        // Code Running in Transaction
    },{
        maxWait:5000,
        timeout:10000
    }
)
const router = Router();
const TOTAL_SUBMISSIONS = 100;

router.post("/payout",workerMiddleware,async(req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const worker = await prismaClient.worker.findFirst({
        where:{
            id:Number(userId)
        }
    });

    if(!worker){
        return res.status(411).json({
            message:"user Not Found"
        })
    }

    // Logic to create Txn
    const txnId = "0x232drvelop"
    await prismaClient.$transaction(async tx=>{
            await tx.worker.update({
                where:{
                    id:userId
                },
                data:{
                    pending_amount:{
                        decrement:worker.pending_amount
                    },
                    locked_amount:{
                        increment:worker.pending_amount
                    }
                }
            });
        await tx.payouts.create({
            data:{
                user_id:Number(userId),
                amount:worker.pending_amount,
                status:"Processing",
                signature:txnId
            }
        })  

    })
    res.json({
        message:"Processing Payout",
        amount:worker.pending_amount
    })
})

router.get("/balance",workerMiddleware,async(req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const worker = await prismaClient.worker.findFirst({
        where:{
            id:userId
        },
    });
    res.json({PendingAmount:worker?.pending_amount,LockedAmount:worker?.locked_amount})
})

router.post("/submission",workerMiddleware,async(req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;
    const parseData = createSubmissionInput.safeParse(body);
    if(parseData.success){
        const task = await NextTask(userId);
        if(!task || task?.id !== Number(parseData.data.taskId)){
            return res.status(411).json({
                message:"Incorrrect Taks Id"
            })
        };
        const amount = (Number(task.amount)/TOTAL_SUBMISSIONS).toString()
       
       const submission =  await prismaClient.$transaction(async tx => {
            const submission = await tx.submission.create({
                data:{
                    worker_id:userId,
                    task_id:Number(parseData.data.taskId),
                    option_id:Number(parseData.data.selection),
                    amount:Number(amount)
                }
            });
            await tx.worker.update({
                where:{
                    id:userId,
                },
                data:{
                    pending_amount:{
                        increment:Number(amount)
                    }
                }
            })

            return submission;
        })

        const  nexTask = await NextTask(userId);
        res.json({
            nexTask,
            amount:amount
        })
    }else{
        res.status(411).json({
            message:"Incorrect Inputss"
        })
    }

})

router.get("/nexttask",workerMiddleware,async(req,res)=>{
    // @ts-ignore
    const userId = req.userId;
    const task = await NextTask(userId);
    if(!task){
        res.status(404).json({
            message:"No Task left 4 u"
        })
    }else{
        res.json({task});
    }
})

router.post("/signin",async(req,res)=>{
    const hardcodedAddress = "Hdcfs0908XX09jpskikwo0paK";

    const existingUser = await prismaClient.worker.findFirst({
        where: {
            address: hardcodedAddress,
        },
    });
    if (existingUser) {
        const token = jwt.sign({userId: existingUser.id,},process.env.WORKER_JWT_SECRET!!);
        res.json({
            token,
        });
    } else {
        const user = await prismaClient.worker.create({
            data: {
                address: hardcodedAddress,
                pending_amount:0,
                locked_amount:0,
            },
        });
        const token = jwt.sign({userId: user.id,},process.env.WORKER_JWT_SECRET!!);

        res.json({ token });
    }
});

export default router;
