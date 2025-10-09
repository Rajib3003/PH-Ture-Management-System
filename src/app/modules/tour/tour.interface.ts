import { Types } from "mongoose";



export interface ITour {
    title: string;
    slug: string;
    description?: string;
    image?: string;
    location?: string;
    costFrom?: number;
    startDate?: Date;
    endDate?: Date;
    included?: string[];
    excluded?: string[];
    amenities?: string[];
    turePlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId;
    tourType: Types.ObjectId; 
}