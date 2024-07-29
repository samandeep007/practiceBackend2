import 'dotenv/config'

const dbName = "blogger";
const cloudinaryDetails = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}
export {dbName, cloudinaryDetails}