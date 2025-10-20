
// Frontend -> Form Data with Image File -> Multer -> Form data -> Req (Body + File)

import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

// Amader folder -> image -> form data -> File -> Multer -> Nijer ekta folder (temporary) -> Req.file

// req.file -> cloudingary (req.file) -> url -> mongoose -> mongobd

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
})

export const cloudinaryUpload = cloudinary