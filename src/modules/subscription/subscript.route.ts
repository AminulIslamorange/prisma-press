import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import { auth } from "../../midlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router=Router();

router.post('/checkout',
    auth(Role.USER,Role.ADMIN,Role.AUTHOR),
    subscriptionController.createCheakOutSession)

export const subscriptionRoutes= router
