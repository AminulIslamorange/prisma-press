import { Response } from "express";

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
export const sendResponce=<T>(res:Response, data:TResponceData<T>)=>{
  res.status(data.statusCode).json({
    success:data.success,
    statusCode:data.statusCode,
    message:data.message,
    data:data.data,
    meta:data.meta
  })  
}