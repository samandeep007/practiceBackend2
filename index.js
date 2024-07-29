import { app } from "./src/app.js";
import connectDB from "./src/db/dbConnect.js";
import 'dotenv/config'

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is listening to port " + PORT);
    })
}).catch((error) => {
    console.error("MongoDB connection failed", error)
})