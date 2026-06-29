import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from 'http-status';
import config from "../../config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";




// const registerUser=async(req:Request,res:Response)=>{
//     try {
//         const payload=req.body;
//     const user=await userService.registerUserIntoDB(payload)


//     res.status(httpStatus.CREATED).json({
//         success:true,
//         statusCode:httpStatus.CREATED,
//         message:'User Register Successfully',
//         data:{
//             user
//         }

//     })
//     } catch (error) {
//         console.log(error);
//         res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//            success:false,
//            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
//            message:'Failed to register user' ,
//            error:(error as Error).message
//         })
        
//     }
// }
type TMeta={
    page:number;
    limit:number;
    total:number;

}
type TResponceData<T>={
  success:boolean;
  statusCode:number;
  message:string;
  data:T;
  meta?:TMeta
}
const sendResponce=<T>(res:Response, data:TResponceData<T>)=>{
  res.status(data.statusCode).json({
    success:data.success,
    statusCode:data.statusCode,
    message:data.message,
    data:data.data,
    meta:data.meta
  })  
}

const registerUser=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
     const payload=req.body;
    const user=await userService.registerUserIntoDB(payload)


    // res.status(httpStatus.CREATED).json({
    //     success:true,
    //     statusCode:httpStatus.CREATED,
    //     message:'User Register Successfully',
    //     data:{
    //         user
    //     }

    // })

    sendResponce(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:'User Register successfully',
           data:{user}
    })

})

export const userController={registerUser}