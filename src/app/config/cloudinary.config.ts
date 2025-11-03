/* eslint-disable @typescript-eslint/no-explicit-any */

// Frontend -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";
import AppError from "../errorHelpers/AppError";

// Amader folder -> image -> form data -> File -> Multer -> Nijer ekta folder (temporary) -> Req.file

// req.file -> cloudingary (req.file) -> url -> mongoose -> mongobd

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})

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