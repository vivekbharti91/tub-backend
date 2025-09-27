import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
    // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    // api_key: process.env.CLOUDINARY_API_KEY,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    // secure: true,
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
});

const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        if (!filePath) return null;
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            ...options,
        })
        // file is uploaded successfully
        console.log("file is uploaded successfully", response.secure_url);
        fs.unlinkSync(filePath);// delete the file from local uploads folder after successful upload
        return response
    } catch (error) {
        fs.unlinkSync(filePath);// delete the file from local uploads folder if error occurs
        return null;
    }
}


export { uploadToCloudinary }

// cloudinary.uploader.upload("my_image.jpg", { folder: "test" })
//   .then(result => console.log(" Uploaded:", result.secure_url))
//   .catch(err => console.error(" Error:", err));