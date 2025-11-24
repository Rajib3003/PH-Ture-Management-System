import { Types } from "mongoose";


export interface INoticeType {
    name: string;
}
export interface INotice {
  id?: number;
  title: string;
  slug: string;
  date: Date;        
  description?: string;    
  images?: string[];   
  deleteImages?: string[];
  noticeType: Types.ObjectId;
}
