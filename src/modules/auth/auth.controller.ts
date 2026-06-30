import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponce } from "../../utils/sendResponce";
import httpStatus from 'http-status';

const loginUser=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payload=req.body;

   const loginResult=await authService.loginUser(payload);

sendResponce(res,{
    success:true,
    statusCode:httpStatus.OK,
    message:'User Logged in Successfully',
    data:loginResult

})
})


export const authController={
    loginUser
}