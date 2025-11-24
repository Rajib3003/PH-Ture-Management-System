import { model, Schema } from "mongoose";
import { INotice } from "./notice.interfaces";



const NoticeSchema: Schema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  link: { type: String },
  photo: { type: String }
}, {
    timestamps: true,
    versionKey: false, 
});



export const Notice = model<INotice>('Notice', NoticeSchema);