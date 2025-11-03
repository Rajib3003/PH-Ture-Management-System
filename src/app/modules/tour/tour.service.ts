
import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";

import { Tour, TourType } from '../tour/tour.model';
import { ITour, ITourType } from './tour.interface';
import { tourSearchableFields } from './tour.constant';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { deleteImageFromCloudinary } from '../../config/cloudinary.config';




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
     
    const queryBuilder = new QueryBuilder(Tour.find(), query );
    const tours = queryBuilder
    .search(tourSearchableFields)
    .filter()
    .sort()
    .fields()
    .paginate()   

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()

    ])

    return {
        data,
        meta
    }
}

const getSingleTour = async (slug: string)=>{
    const result = await Tour.findOne({slug});
   
    return {
        data: result,
    }
}

const updateTour = async(tourId: string, payload: Partial<ITour>)=>{
    const existingTour = await Tour.findById(tourId);
    if(!existingTour){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour ID not found", "");
    }   

    if(payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0){
        
        payload.images = [ ...payload.images, ...existingTour.images];
    }

    if(payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0){
        const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatePayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl))

        payload.images = [...restDBImages, ...updatePayloadImages]; 
    }

    const updatedTour = await Tour.findByIdAndUpdate(tourId, payload, {new: true, runValidators: true});

    if(payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0){
        await Promise.all(payload.deleteImages.map(url=>deleteImageFromCloudinary(url)));
    }

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
    getSingleTour, 
    updateTour,
    deleteTour,
    getAllTourTypes,
    createTourType,
    updateTourType,
    deleteTourType 
}