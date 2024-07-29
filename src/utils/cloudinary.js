import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import { cloudinaryDetails } from '../constants.js';

cloudinary.config({
    cloud_name: cloudinaryDetails.cloud_name,
    api_key: cloudinaryDetails.api_key,
    api_secret: cloudinaryDetails.api_secret
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