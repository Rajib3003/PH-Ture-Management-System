import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";

import { Tour, TourType } from '../tour/tour.model';
import { ITour, ITourType } from './tour.interface';




const createTour = async(payload:  ITour) => {
    // Check if division exists
    // const divisionExists = await Division.findById(payload.division);
    // if (!divisionExists) throw new Error("Division not found");

    // Check if tourType exists
    // const tourTypeExists = await TourType.findById(payload.tourType);
    // if (!tourTypeExists) throw new Error("Tour type not found");

    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    const tour = await Tour.create(payload);
    return tour;
}

const getAllTours = async()=>{
    const tour = await Tour.find({})
    .populate('division')
    .populate('tourType');
    const countTour = await Tour.countDocuments();
    return {
        data: tour,
        meta: {
            total: countTour
        }
    }
}

const updateTour = async(tourId: string, payload: Partial<ITour>)=>{
    const existingTour = await Tour.findById(tourId);
    if(!existingTour){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour ID not found", "");
    }
    // if(payload.division){
    //     const divisionExists = await Division.findById(payload.division);
    //     if (!divisionExists) throw new Error("Division not found");
    // }
    // if(payload.tourType){
    //     const tourTypeExists = await TourType.findById(payload.tourType);
    //     if (!tourTypeExists) throw new Error("Tour type not found");
    // }
    const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {new: true, runValidators: true});
    return updatedTour
}



const deleteTour = async(tourId: string)=>{ 
     await Tour.findByIdAndDelete(tourId);
    return null;
}

const createTourType = async(payload: ITourType)=>{
    // create logic here
    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourType.create({ name });
    
}

const getAllTourTypes = async()=>{
    return await TourType.find(); 
}


const updateTourType = async(tourTypesId: string, payload: ITourType)=>{
    // update logic will be implemented here
    const existingTourType = await TourType.findById(tourTypesId);
    if(!existingTourType){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour Types ID not found", "");
    }

    const updatedTourType = await TourType.findByIdAndUpdate(tourTypesId, payload, {new: true, runValidators: true});
    return updatedTourType
}

const deleteTourType = async(tourTypesId: string)=>{
    const existingTourType = await TourType.findById(tourTypesId);
    if(!existingTourType){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour Types ID not found", "");
    }

    return await TourType.findByIdAndDelete(tourTypesId);
 
}


export const TourService = {    
    createTour,
    getAllTours,   
    updateTour,
    deleteTour,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType 
}