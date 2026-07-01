import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import httpStatus from 'http-status';
import config from "../../config";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/sendResponce";
import jwt from 'jsonwebtoken';
import { jwtUtils } from "../../utils/jwt";




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

const getMyProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    // const {accessToken}=req.cookies;

    // const verifiedToken=jwtUtils.verifyToken(accessToken,config.jwt_access_secret)

    // if(typeof verifiedToken ==="string"){
    //     throw new Error(verifiedToken);
    // }

    const profile=await userService.getMyProfileIntoDB(req.user?.id as string)

    sendResponce(res,{
        success:true,
        message:'User profile fatched successfully',
        statusCode:httpStatus.OK,
        data:{profile}
    })

})

const updateMyProfile=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.id as string;
    const payload=req.body;
    const updatedProfile=await userService.updateMyProfileIntoDB(userId,payload);
    sendResponce(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"user data updated successfully",
        data:{updatedProfile}
    })

})

export const userController={registerUser,getMyProfile,updateMyProfile}