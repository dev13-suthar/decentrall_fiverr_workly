import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import {S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { authMiddleware } from "../middlewares/authMiddleware";
import { createTaskInputs } from "../types";
import { TOTAL_DECIMAL } from "../config";

 
const s3Client = new S3Client({
    credentials:{
        accessKeyId:process.env.AWS_ACCESS_KEY!!,
        secretAccessKey:process.env.AWS_SECRET!!,
    },
    region:"eu-north-1"
})

const router = Router();
const prismaClient = new PrismaClient();
prismaClient.$transaction(
    async(prisma)=>{
        // Code Running in Transaction
    },{
        maxWait:5000,
        timeout:10000
    }
)

router.get("/task",authMiddleware,async(req,res)=>{
    // @ts-ignore
    const userId = req.userId
     // @ts-ignore
    const taksId :string= req.query.taskId;
    
    const taskDetails = await prismaClient.task.findFirst({
        where:{
            user_id:userId,
            id:Number(taksId)
        },
        include:{
            options:true
        }
    })
    if(!taskDetails){
        return res.status(404).json({
            message:"Cannot find Any Taks"
        })
    }
    const responses = await prismaClient.submission.findMany({
        where:{
            task_id:Number(taksId),
        },
        include:{
            option:true
        }
    });

    const result:Record<string,{
        count:number,
        option:{
            imageUrl:string
        }
    }> = {};

    taskDetails.options.forEach(option=>{
        result[option.id] = {
            count:0,
            option:{
                imageUrl:option.image_url
            }
        }
    });
    responses.forEach(r=>{
        result[r.option_id].count++;
    });
    
    const resultArray = Object.keys(result).map(key=>({
        id:key,
        count:result[key].count,
        option:result[key].option
    }));

    res.json({resultArray});
})

router.post("/task",authMiddleware,async(req,res)=>{
        // @ts-ignore
        const userId = req.userId;
        const body = req.body;
        const parseData = createTaskInputs.safeParse(body);

        const user = await prismaClient.user.findFirst({
            where: {
                id: userId
            }
        })

        if(!parseData.success){
            return res.status(411).json({
                message:"Incorrect Inputs"
            })
        }
        
       let response =  await prismaClient.$transaction(async tx => {
           const response =  await tx.task.create({
                data:{
                    title:parseData.data.title ?? "Select the Most clickable Thumbnail",
                    amount:1*TOTAL_DECIMAL,
                    signature:parseData.data.signature,
                    user_id:userId
                }
            });
            await tx.option.createMany({
                data:parseData.data.options.map(x=>({
                    image_url:x.imageUrl,
                    task_id:response.id,
                }))
            })
            return response
        })
        res.json({
            id:response.id
        })
})

router.get("/presignedUrl",authMiddleware,async(req,res)=>{ 

    // @ts-ignore
    const userId = req.userId
    const { url, fields } = await createPresignedPost(s3Client, {
        Bucket: 'decentrall-fivver',
        Key: `fiverrr/${userId}/${Math.random()}/image.jpg`,
        Conditions: [
          ['content-length-range', 0, 5 * 1024 * 1024] // 5 MB max
        ],
        Fields: {
          'Content-Type': 'image/png'
        },
        Expires: 3600
      })
     res.json({
        presignedUrl:url,
        fields
     })
})

router.post("/signin", async (req, res) => {
    // Sign varifiess
    const hardcodedAddress = "Hdcfs0908XX09jpskikwo0";

    const existingUser = await prismaClient.user.findFirst({
        where: {
            address: hardcodedAddress,
        },
    });
    if (existingUser) {
        const token = jwt.sign({userId: existingUser.id,},process.env.JWT_SECRET!!);
        res.json({
            token,
        });
    } else {
        const user = await prismaClient.user.create({
            data: {
                address: hardcodedAddress,
            },
        });
        const token = jwt.sign({userId: user.id,},process.env.JWT_SECRET!!);

        res.json({ token });
    }
});

export default router;
