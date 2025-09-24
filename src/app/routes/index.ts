import { authRoutes } from '../modules/auth/auth.router';
import { userRoutes } from './../modules/user/user.router';
import { Router } from "express";

export const router = Router();

const modelRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
]

modelRoutes.forEach((route)=> {
    router.use(route.path, route.route)
})