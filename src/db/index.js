
import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";




const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error in DB connection", error);
        process.exit(1);
    }
}

export default connectDB;


/*
connectionInstance → this is the object you get after connecting to MongoDB.

.connection → inside that object, there’s info about the database connection.

.host → one of those pieces of info is the host name (where the database is running, e.g. localhost or cluster0.mongodb.net).


connectionInstance.connection.host → tells you which server (host) you’re connected to.

connectionInstance.connection.port → shows the port number (default: 27017 for local).

connectionInstance.connection.name → shows which database you’re using.

connectionInstance.connection.user → shows which user is connected (if authentication is used).

Without process.exit(1) → program continues even after an error.

With process.exit(1) → program ends immediately with a failure status.
*/