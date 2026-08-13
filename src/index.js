import moongoes from 'mongoose';
import {DB_NAME} from './constants.js';
import express from 'express';
import connectDB from './db/index.js';
import dotenv from 'dotenv';
import { app } from './app.js';

dotenv.config({
    path: "./.env"
})


connectDB()
.then( () => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is listening on PORT : ${process.env.PORT}`)
    })
})
.catch( (err) => {
    console.log("MONOGO db connection failed", err)
})




/* approch to connect to databasse and start the server
const app = express();
( async ()=> {
    try {
        await moongoes.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        app.on("error", (error) => {
            console.error("ERRR", error)
            throw error;
        })

        app.listen(process.env.PORT, ()=>{
            console.log(`server is running on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR", error)
        throw error
    } 
})()
*/