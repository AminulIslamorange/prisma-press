import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from 'http-status';
import config from "../../config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/sendResponce";




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