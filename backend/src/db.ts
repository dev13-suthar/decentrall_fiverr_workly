import { PrismaClient } from "@prisma/client"

const prismaClient = new PrismaClient();
export const NextTask = async(userId:string)=>{
    const task = await prismaClient.task.findFirst({
        where:{
            done:false,
            submissions:{
                none:{
                    worker_id:Number(userId)
                }
            }
        },
        select:{
            id:true,
            title:true,
            amount:true,
            options:true,
        }
    });
    return task;
}