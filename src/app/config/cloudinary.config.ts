import httpStatusCode  from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-explicit-any */

// Frontend -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";
import stream from "stream";

// Amader folder -> image -> form data -> File -> Multer -> Nijer ekta folder (temporary) -> Req.file

// req.file -> cloudingary (req.file) -> url -> mongoose -> mongobd

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName : string) : Promise<UploadApiResponse | undefined> => {
    try {
        
      return new Promise((resolve, reject) => {
        const public_id = `pdf/${fileName}-${Date.now()}`;

        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        cloudinary.uploader.upload_stream({
          resource_type: 'auto',
          folder: 'pdf', 
          public_id,
        }, (error, result) => {
          if (error) {
            reject(error);
          } 
            resolve(result);
          
        }).end(buffer);

      });

    } catch (error : any) {
        throw new AppError(httpStatusCode.BAD_REQUEST, `Error uploading file ${error.message}`,"");
    }
}

export const deleteImageFromCloudinary = async (url: string ) => {
  try {
      const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp|bmp|tiff|svg)$/i;
    const match = url.match(regex);

    if (match && match[1]) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
    } 
  } catch (error : any) {
    throw new AppError(401, "Failed to delete image from Cloudinary", error.message);
  }
}



export const cloudinaryUpload = cloudinary