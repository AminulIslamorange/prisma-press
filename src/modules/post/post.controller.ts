import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponce } from "../../utils/sendResponce";
import httpStatus from 'http-status'
import { postService } from "./post.service";

const createPost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const id = req.user?.id

    const payload = req.body;

    const result = await postService.createPost(payload, id as string);


    sendResponce(res, {
        success : true,
        statusCode : httpStatus.CREATED,
        message : "Post Created SuccessFully",
        data : result
    })
})

const getAllPosts = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const result = await postService.getAllPosts();

    sendResponce(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Posts Retrieved Successfully",
        data : result
    })
})
const getPostById = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const postId = req.params.postId;

    if(!postId){
        throw new Error("Post Id Required In Params")
    }

    const result = await postService.getPostById(postId as string);

    sendResponce(res, {
        success : true,
        statusCode : httpStatus.OK,
        message : "Post retrieved successfuly",
        data : result
    })
})
const updatePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    const payload = req.body;

    const result = await postService.updatePost(postId as string, payload, authorId as string, isAdmin)

    sendResponce(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post updated successfully",
        data: result
    })
})
const deletePost = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id
    const isAdmin = req.user?.role === "ADMIN";

    const postId = req.params.postId;
    if (!postId) {
        throw new Error("Post Id Required In Params")
    }

    await postService.deletePost(postId as string, authorId as string, isAdmin)

    sendResponce(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Post deleted successfully",
        data: null
    })
})

const getMyPosts = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
    const authorId = req.user?.id;

    const result = await postService.getMyPosts(authorId as string);

    sendResponce(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My Posts retrieved successfuly",
        data: result
    })
})


export const postController = {
    createPost,getAllPosts,getPostById,getMyPosts,updatePost,deletePost }