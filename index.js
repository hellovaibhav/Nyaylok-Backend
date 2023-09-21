import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import schedule from "node-schedule";

// function imports
import homeRoute from "./routes/homeRoute.js";
import caseRoute from "./routes/caseRoute.js";
import authRoute from "./routes/authRoute.js";
import Case from "./models/Case.js";

const app = express();

dotenv.config();

const port = process.env.PORT || 1978;

var allowedOrigins = [
];

var options = {
  credentials: true,
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(options));

app.use(cookieParser());
app.use(express.json());

schedule.scheduleJob("0 0 0 * * *", async () => {
  try {
    // Update points for cases with the specified conditions
    const updatedCases = await Case.updateMany(
      {
        $or: [{ status: "Registered" }, { status: "Ongoing" }],
      },
      {
        $inc: { points: 1 }, // Increment points by 1
      }
    );

    // console.log(`Points updated for ${updatedCases} cases.`);
  } catch (error) {
    console.error("Error updating points:", error);
  }
});

const connect = () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("Connected to database");
  } catch (err) {
    throw err;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("Database is disconnected");
});

// middelwares
app.use("/", homeRoute);
app.use("/cases", caseRoute);
app.use("/auth", authRoute);

app.listen(port, () => {
  connect();
  console.log(`Server is up and runnning on port ${port}`);
});
