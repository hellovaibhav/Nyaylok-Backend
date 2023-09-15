import express from "express";
import moment from "moment-timezone";

// import files
import Case from "../models/Case.js";
import { getCaseId } from "../utils/caseUtils.js";
import { totalPoints } from "../utils/algorithm.js";

export const registerCase = async (req, res, next) => {

    try {

        const caseNum = await getCaseId();

        const newCase = new Case({
            victimName: req.body.victim,
            firNumber: req.body.fir,
            policeStationName: req.body.policeStation,
            areaPincode: req.body.pincode,
            IPCsections: req.body.IPCs,
            prevCaseId: req.body.prevCaseId,
            caseId: caseNum
        });

        const score = await totalPoints(newCase.IPCsections, newCase.points);

        newCase.points = score.points;

        const savedCase = await newCase.save();

        res.status(200).json({ message: "Case filed successfully", savedCase });

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
            }).sort({ points: -1 });


        res.status(200).json({ message: `successfull found ${cases.length} cases`, cases });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
};

export const getCaseById = async (req, res, next) => {
    try {

        const arr = await Case.find();

        let foundCase;

        const index = arr.findIndex((element) => {
            if (element.caseId == req.params.caseId) {
                foundCase = element;
                return element.caseId == req.params.caseId;
            }
        });

        if (index !== -1) {
            const date = moment().utc(foundCase.DOR).tz("Asia/Kolkata").format('DD-MM-YYYY');
            res.status(200).json({
                message: "Found your case",
                casePosition: index,
                victim: foundCase.victimName,
                dor: date,
                status: foundCase.status
            });
        }
        else {
            res.status(404).json({ message: "Cannot find any case with that ID" });
        }

    } catch (err) {
        console.log(err);
        next(err);
    }
}