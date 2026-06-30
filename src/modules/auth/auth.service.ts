import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import jwt, { SignOptions } from 'jsonwebtoken';
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";


const loginUser = async (payload: ILoginUser) => {
    const { email, password } = payload;
    const user = await prisma.user.findUniqueOrThrow({
        where: { email }

    })
    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        throw new Error("password is incorrect")
    }
const jwtPayload={
     id: user.id,
        name:user.name,
        email: user.email,
        role: user.role

}
//     const accessToken = jwt.sign(jwtPayload,
//         config.jwt_access_secret,
//          {
//         expiresIn:config.jwt_access_expires_in

//     } as SignOptions
// );
const accessToken=jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions
)

//     const refreshToken=jwt.sign(jwtPayload,
//         config.jwt_refresh_secret,
        
//        { expiresIn:config.jwt_refresh_expires_in
//     }as SignOptions
// )

const refreshToken=jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions
)
    return{
        accessToken,
        refreshToken
    }



    return user;


}

export const authService = { loginUser }