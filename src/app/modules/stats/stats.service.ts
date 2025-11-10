/* eslint-disable @typescript-eslint/no-explicit-any */
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payment } from "../payment/payment.model";
import { Tour } from "../tour/tour.model";
import { isActived } from "../user/user.interface";
import { User } from "../user/user.model";


const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);



const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments();
    const totalActiveUsersPromise = User.countDocuments({ isActive: isActived.ACTIVE });
    const totalInActiveUsersPromise = User.countDocuments({ isActive: isActived.INACTIVE });
    const totalBlockedUsersPromise = User.countDocuments({ isActive: isActived.BLOCKED });

    const newUserInLast7DaysPromise = User.countDocuments({ 
        createdAt: { $gte: sevenDaysAgo } });
    const newUserInLast30DaysPromise = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    
    const usersByRolePromise = User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);

    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUserInLast7Days, newUserInLast30Days, usersByRole ] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUserInLast7DaysPromise,
        newUserInLast30DaysPromise,
        usersByRolePromise
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUserInLast7Days,
        newUserInLast30Days,
        usersByRole
    };
    // logic to get user stats
}
const getTourStats = async () => {
    const totalTourPromise = Tour.countDocuments();
    const totalTourByTourTypePromise = Tour.aggregate([
        {
         
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        {
            $unwind: "$type"
        },
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }

    ]);

    const avgTourCostPromise = Tour.aggregate ([
        {
            $group: {
                _id: null,
                aveCostFrom: { $avg: "$costFrom" }
            }
        }
    ])

    const totalTourByDivisionPromise = Tour.aggregate([
        {
         
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        {
            $unwind: "$division"
        },
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ])

    const totalHighestBookedTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1}
            }
        },
        {
            $sort : { bookingCount: -1 }
        },
        { $limit : 5 },
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                         $match: { 
                            $expr: { 
                                $eq: ["$_id", "$$tourId"] 
                            } 
                        } 
                    },
                ],
                as: "tour"
            }
        },
        { $unwind: "$tour"},
        {
         $project: {  
            bookingCount: 1,          
            tourTitle: "$tour.title",
            tourSlug: "$tour.slug"
         }   
        }
       


    ])



    const [totalTour, totalTourByTourType, avgTourCost, totalTourByDivision, totalHighestBookedTour ] = await Promise.all([
        totalTourPromise,
        totalTourByTourTypePromise,
        avgTourCostPromise,
        totalTourByDivisionPromise,
        totalHighestBookedTourPromise
    ]);
    return {
        totalTour,
        totalTourByTourType,
        avgTourCost,
         totalTourByDivision,
         totalHighestBookedTour
    };    
}
const getBookingStats = async () => {
    const totalBookingPromise =  Booking.countDocuments();
    const totalBookingByStatusgPromise =  Booking.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const bookingPerTourPromise = Booking.aggregate([
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1}
            }
        },
        {
            $sort: { bookingCount: -1 }
        },
        {
            $limit: 10
        },
        {
            $lookup: {
                from: "tours",               
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },
        { $unwind: "$tour" },
        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title" : 1,
                "tour.slug" : 1
            }
        }

    ])
    const avgGuestCountPerBookingPromise = Booking.aggregate([
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ])

    const bookingLastSevenDaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const bookingLastThirtyDaysPromise = Booking.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const totalBookingByUniqueUsersPromise = Booking.distinct("user").then((user : any) => user.length);

    const [totalBooking, totalBookingByStatusg,bookingPerTour, avgGuestCountPerBooking, bookingLastSevenDays, bookingLastThirtyDays, totalBookingByUniqueUsers ] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusgPromise,
        bookingPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingLastSevenDaysPromise,
        bookingLastThirtyDaysPromise,
        totalBookingByUniqueUsersPromise
    ]);



    return {
        totalBooking,
        totalBookingByStatusg,
        bookingPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingLastSevenDays,
        bookingLastThirtyDays,
        totalBookingByUniqueUsers
    };
    
}
const getPaymentStats = async () => {
    const totalPaymentPromise = Payment.countDocuments();

    const totalPaymentStatusPromise = Payment.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const totalRevenuePromise = Payment.aggregate([
        {
            $match: {
                status: PAYMENT_STATUS.PAID
            }
        },
        {
            $group: {
                _id: null, 
                totalRevenue: { $sum: "$amount"}
            }
        }
    ])
    const avgPaymentAmountPromise = Payment.aggregate([
        {
            $group: {
                _id: null,
                avgPaymentAmount : {$avg: "$amount"}
            }
        }
    ])

    const paymentGeteWayDataPromise = Payment.aggregate([
        {
            $group: {
                _id: {$ifNull: ["$paymentGatewayData.status", "unknown"]},
                count: { $sum: 1 }
            }
        }
    ])

    const [totalPayment,totalPaymentStatus, totalRevenue, avgPaymentAmount, paymentGeteWayData] = await Promise.all([
        totalPaymentPromise,
        totalPaymentStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGeteWayDataPromise
    ]);
    return {
        totalPayment,
        totalPaymentStatus,
        // totalRevenue: totalRevenue[0] ? totalRevenue[0].totalRevenue : 0
        totalRevenue,
        avgPaymentAmount,
        paymentGeteWayData
    };
}

export const StatsService = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats
};