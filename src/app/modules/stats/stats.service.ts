import { Booking } from "../booking/booking.model";
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
    // logic to get tour stats
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
    const [totalBooking, totalBookingByStatusg ] = await Promise.all([
        totalBookingPromise,
        totalBookingByStatusgPromise
    ]);

    return {
        totalBooking,
        totalBookingByStatusg
    };
    
}
const getPaymentStats = async () => {
    // logic to get payment stats
}

export const StatsService = {
    getBookingStats,
    getPaymentStats,
    getUserStats,
    getTourStats
};