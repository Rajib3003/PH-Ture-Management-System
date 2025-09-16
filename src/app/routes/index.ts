import { userRoutes } from './../modules/user/user.router';
import { Router } from "express";

export const router = Router();

const modelRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
]

modelRoutes.forEach((route)=> {
    router.use(route.path, route.route)
})