import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";

// function imports
import homeRoute from "./routes/homeRoute.js"

const app = express();

dotenv.config();

const port = process.env.PORT || 1978;

app.use(cookieParser());


var allowedOrigins = ['localhost:2023'];


var options = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(cors(options));

const connect = () => {
    try {
        mongoose.connect(process.env.MONGO);
        console.log("Connected to database");
    }
    catch (err) {
        throw err;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Database is disconnected");
});

// middelwares
app.use("/", homeRoute);

app.listen(port, () => {
    connect();
    console.log(`Server is up and runnning on port ${port}`)
});