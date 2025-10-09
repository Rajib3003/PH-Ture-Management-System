import httpStatusCode from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { ITourType } from "./tourTypes.interface"
import { TourType } from './tourTypes.model';
import { Tour } from '../tour/tour.model';


const createTourTypes = async(payload: Partial<ITourType>)=>{
    // create logic here
    const {name} =  payload;
    const nameExists = await TourType.findOne({where: {name}});
    if(nameExists){
        throw new AppError(httpStatusCode.BAD_REQUEST, 'Tour type name already exists','');
    }
    const tourType = await TourType.create({
        name
    })
    return tourType
    
}

const getAllTourTypes = async()=>{
    const tourType = await TourType.find({});
    const countTourType = await TourType.countDocuments();
    return {
        data: tourType,
        meta: {
            total: countTourType
        }
    }
}

const updateTourTypes = async(tourTypesId: string, payload: Partial<ITourType>)=>{
    // update logic will be implemented here
    const tourTypesIdExist = await TourType.findById(tourTypesId);
    if(!tourTypesIdExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour Types ID not found", "");
    }
    if(payload.name){
        const nameExists = await TourType.findOne({name: payload.name, _id: {$ne: tourTypesId}});
        if(nameExists){
            throw new AppError(httpStatusCode.CONFLICT, "Name already exists", "");
        }
    }
    const updatedTourTypes = await TourType.findByIdAndUpdate(tourTypesId, payload, {new: true, runValidators: true});
    return updatedTourTypes
}

const deleteTourTypes = async(tourTypesId: string)=>{
    const tourTypesIdExist = await TourType.findById(tourTypesId);
    if(!tourTypesIdExist){
        throw new AppError(httpStatusCode.NOT_FOUND, "Tour Types ID not found", "");
    }
      const linkedTours = await Tour.findOne({ tourType: tourTypesId });
  if (linkedTours) {
    throw new AppError(
      httpStatusCode.BAD_REQUEST,
      "Cannot delete this tour type because tours are linked to it.",
      ""
    );
  }
await TourType.findByIdAndDelete(tourTypesId);
return {
    message: "Tour type deleted successfully!",
  };
}


export const tourTypesService = {
    createTourTypes,
    getAllTourTypes,
    updateTourTypes,
    deleteTourTypes
}