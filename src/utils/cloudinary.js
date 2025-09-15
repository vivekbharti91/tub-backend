import { v2 as cloudinary } from "cloudinary";    
import { response } from "express";
import fs from "fs";

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
});

const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        if(!filePath) return null;
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            ...options,
        })
        // file is uploaded successfully
        console.log("file is uploaded successfully",  response.secure_url);
        return response
    } catch (error) {
        fs.unlinkSync(filePath);// delete the file from local uploads folder if error occurs
        return null;
    }
}


export { uploadToCloudinary}

// cloudinary.uploader.upload("my_image.jpg", { folder: "test" })
//   .then(result => console.log(" Uploaded:", result.secure_url))
//   .catch(err => console.error(" Error:", err));