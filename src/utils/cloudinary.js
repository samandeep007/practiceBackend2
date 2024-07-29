import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import 'dotenv/config'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_proxy: process.env.CLOUDINARY_API_SECRET
})

export default async function uploadOnCloudinary(localFilePath){
    try {
        if(!localFilePath) return null;
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })

        fs.unlinkSync(localFilePath);
        console.log("Upload on cloudinary successful", response.url);
        return response;

    } catch (error) {
        console.error("Upload on cloudinary failed!", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}