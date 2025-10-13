import { authRoutes } from '../modules/auth/auth.router';
import { divisionRoutes } from '../modules/division/division.router';
import { tourRoutes } from '../modules/tour/tour.router';
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
    {
        path: "/division",
        route: divisionRoutes
    },
    {
        path: "/tour",
        route: tourRoutes
    },
]

modelRoutes.forEach((route)=> {
    router.use(route.path, route.route)
})