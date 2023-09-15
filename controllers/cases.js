import express from "express";
import moment from "moment-timezone";

// import files
import Case from "../models/Case.js";
import { totalPoints } from "../utils/algorithm.js";

export const registerCase = async (req, res, next) => {
    // const dateInd = moment.tz("Asia/Kolkata").format();
    // const dateNow =  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    try {

        const newCase = new Case({
            victimName: req.body.victim,
            firNumber: req.body.fir,
            policeStationName: req.body.policeStation,
            areaPincode: req.body.pincode,
            IPCsections: req.body.IPCs,
            prevCaseId: req.body.prevCaseId,
            // DOF: dateInd,
        });

        // console.log(newCase);
        const pointsCalc = await totalPoints(newCase.IPCsections, newCase.points);

        newCase.points = pointsCalc.points;
        // console.log(moment.utc(newCase.DOR).tz("Asia/Kolkata").format());

        const savedUser = await newCase.save();

        res.status(200).json({ message: "Case filed successfully", savedUser });

    } catch (err) {
        res.status(404).json({ message: "there was some error case has not been uploaded yet" });
        next(err);
    };
};

export const getUncompleteCases = async (req, res, next) => {
    try {
        const cases = await Case.find(
            {
                $or: [{ status: "Registered" }, { status: "Ongoing" }],
            }).sort({points:-1});


        res.status(200).json({ message: `successfull found ${cases.length} cases`, cases });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};