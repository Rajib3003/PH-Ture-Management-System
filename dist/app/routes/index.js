"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const auth_router_1 = require("../modules/auth/auth.router");
const booking_router_1 = require("../modules/booking/booking.router");
const division_router_1 = require("../modules/division/division.router");
const otp_router_1 = require("../modules/otp/otp.router");
const payment_router_1 = require("../modules/payment/payment.router");
const stats_router_1 = require("../modules/stats/stats.router");
const tour_router_1 = require("../modules/tour/tour.router");
const user_router_1 = require("./../modules/user/user.router");
const express_1 = require("express");
exports.router = (0, express_1.Router)();
const modelRoutes = [
    {
        path: "/user",
        route: user_router_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_router_1.AuthRoutes
    },
    {
        path: "/division",
        route: division_router_1.DivisionRoutes
    },
    {
        path: "/tour",
        route: tour_router_1.TourRoutes
    },
    {
        path: "/booking",
        route: booking_router_1.BookingRoutes
    },
    {
        path: "/payment",
        route: payment_router_1.PaymentRoutes
    },
    {
        path: "/otp",
        route: otp_router_1.OtpRoutes
    },
    {
        path: "/stats",
        route: stats_router_1.StatsRoutes
    },
];
modelRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
