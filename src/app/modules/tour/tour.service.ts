
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";

import { Tour, TourType } from '../tour/tour.model';
import { ITour, ITourType } from './tour.interface';
import { tourSearchableFields } from './tour.constant';




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

const getAllTours = async(query: Record<string, string>)=>{
     
     const filter = query ;   

     const searchTerm = query.searchTerm || "";   
     // jokhon ami searchbar a location and searchTerm diye search korbo tokhon oi 2 ta jinish er maje searchTerm ta delete kore diye just location ta dibe . karon filter exjists meching thakte hoy searching ta full word match korte hoy na. kicho letter match korlei hoy. tai jokhon 2 ta jinish diye search korbo tokhon searchTerm ta filter theke delete kore dite hobe. 
     delete filter.searchTerm; 
     const searchQuery = {
        $or: tourSearchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: "i" } 
     }))
     } 

    const tour = await Tour.find(searchQuery)
    .find(filter)
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
    const name  = payload;

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

     await TourType.findByIdAndDelete(tourTypesId);
     return null;
 
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