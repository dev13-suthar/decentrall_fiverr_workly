import { NextFunction,Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers["authorization"] ?? "";
    try {
        const decoded = jwt.verify(authHeader,process.env.JWT_SECRET!!);
        // @ts-ignore
            if(decoded.userId){
                // @ts-ignore
                req.userId = decoded.userId
                return next()
            }else{
                return res.status(403).json({
                    message:"u are not Logged In"
                })
            }
    } catch (error) {
        return res.status(403).json({
            message:"u are not Logged In"
        })
    }
}