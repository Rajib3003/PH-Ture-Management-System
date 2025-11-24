import { AuthRoutes } from '../modules/auth/auth.router';
import { BookingRoutes } from '../modules/booking/booking.router';
import { DivisionRoutes } from '../modules/division/division.router';
import { NoticeRoutes } from '../modules/notice/notice.router';
import { OtpRoutes } from '../modules/otp/otp.router';
import { PaymentRoutes } from '../modules/payment/payment.router';
import { StatsRoutes } from '../modules/stats/stats.router';
import { TourRoutes } from '../modules/tour/tour.router';
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
        route: AuthRoutes
    },
    {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    },
    {
        path: "/booking",
        route: BookingRoutes
    },
    {
        path: "/payment",
        route: PaymentRoutes
    },
    {
        path: "/otp",
        route: OtpRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    },
    {
        path: "/notice",
        route: NoticeRoutes
    },
]

modelRoutes.forEach((route)=> {
    router.use(route.path, route.route)
})