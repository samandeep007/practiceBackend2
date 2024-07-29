import mongoose from 'mongoose';
import { dbName } from '../constants.js';

export default async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`, {});
        const connectionReference = mongoose.connection;
        
        connectionReference.once('connected', () => {
            console.log("MongoDB connection successful");
        })

        connectionReference.on('error', (error) => {
            console.error("MongoDB connection failed", error);
            process.exit(1);
        })

    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
}