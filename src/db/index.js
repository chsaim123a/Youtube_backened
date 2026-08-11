import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const conectionDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected successfully !! DB Host: ${connectionInstance.connection.host} \n`);
    } catch (error) {
        console.error("mongoose connection error", error)
        process.exit(1);
    }
}

export default conectionDB;