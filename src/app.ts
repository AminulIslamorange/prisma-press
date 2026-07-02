import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, response, Response } from "express";
import cors from 'cors';
import config from "./config";
import httpStatus from 'http-status'



import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { notFound } from "./midlewares/notFound";
import { globalErrorHandlar } from "./midlewares/globalErrorHandlar";
import { subscriptionRoutes } from "./modules/subscription/subscript.route";

const app:Application=express();
app.use(cors({
    origin:config.app_url,
    credentials:true
}));
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get('/',(req:Request,res:Response)=>{
res.send("Hello World")
});

app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/posts',postRoutes)
app.use('/api/comments',commentRoutes)

app.use('/api/subscription',subscriptionRoutes)




// app.use((req:Request, res:Response)=>{
//     res.status(404.).json({
//         message:'Route not found',
//         path:req.originalUrl,
//         date:Date()
//     })

// })

app.use(notFound)
app.use(globalErrorHandlar)

export default app;