import dotenv from "dotenv";
import connectDB from "./db/index.js";


dotenv.config({path: "./.env"});




connectDB();







/*
( async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (err) =>{
            console.error("Error in DB connection", err);
            throw err;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("Error in DB connection", error);
        throw error;
    }
})()
*/