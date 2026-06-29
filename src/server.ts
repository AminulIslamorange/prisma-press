import app from "./app";

import { prisma } from "./lib/prisma";
import config from "./config";
const PORT=config.port;

async function main(){
    try {
        await prisma.$connect();
        console.log('Database connected Successfully');
        app.listen(PORT,()=>{
          console.log(`server in running on port ${PORT}`)  
        })
        
    } catch (error) {
      console.log("Error starting the server",error);
      await prisma.$disconnect();
      process.exit(1);  
    }
}

main();