import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

// ==========================================
// ১. Express Request টাইপ গ্লোবালি এক্সটেন্ড করা
// ==========================================
declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string;
                name: string;
                id: string;
                role: Role;
            };
        }
    }
}

// ==========================================
// ২. মূল Auth মিডলওয়্যার ফাংশন
// ==========================================
export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
        // ক. কুকি অথবা হেডার (Bearer বা ডিরেক্ট) থেকে টোকেন বের করা
        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer")
                ? req.headers.authorization.split(" ")[1]
                : req.headers.authorization;

        // খ. টোকেন না থাকলে এরর থ্রো করা
        if (!token) {
            throw new Error("You are not Logged in. Please Log in to access.");
        }

        // গ. টোকেন ভেরিফাই করা
        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        // ঘ. ভেরিফাইড টোকেন থেকে ডাটা আলাদা করা
        const { email, name, id, role } = verifiedToken.data as JwtPayload;

        // ঙ. রোল বা পারমিশন (Authorization) চেক করা
        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden. You don't have permission to access this.");
        }

        // চ. ডাটাবেজে ইউজার আসলেই বিদ্যমান কি না চেক করা
        const user = await prisma.user.findUnique({
            where: { id, email, name, role }
        });

        if (!user) {
            throw new Error("User not found. Please Log in again.");
        }

        // ছ. ইউজারের অ্যাক্টিভ স্ট্যাটাস চেক করা (ব্লকড কি না)
        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account has been Blocked.");
        }

        // জ. পরবর্তী কন্ট্রোলারের ব্যবহারের জন্য req.user-এ ডেটা সেট করা
        req.user = { email, name, id, role };

        // ঝ. রিকোয়েস্টটি পরের ফাংশনে পাস করে দেওয়া
        next();
    });
};