import express from "express";
import moment from "moment-timezone";
import dotenv from "dotenv";
import twilio from "twilio";


dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// import files
import Case from "../models/Case.js";
import { getCaseId, getCasePosition } from "../utils/caseUtils.js";
import { totalPoints } from "../utils/algorithm.js";

export const registerCase = async (req, res, next) => {

    try {

        const caseNum = await getCaseId();

        const newCase = new Case({
            victimName: req.body.victim,
            firNumber: req.body.fir,
            policeStationName: req.body.policeStation,
            areaPincode: req.body.pincode,
            phoneNumber: req.body.phone,
            IPCsections: req.body.IPCs,
            prevCaseId: req.body.prevCaseId,
            caseId: caseNum
        });

        const score = await totalPoints(newCase.IPCsections, newCase.points);

        newCase.points = score.points;

        const numLength = newCase.phoneNumber.toString().length;
        
        if (numLength == 10) {

            const savedCase = await newCase.save();
            const { index, foundCase } = await getCasePosition(caseNum);

            client.messages
                .create({
                    body: `Dear ${newCase.victimName}, Your case with Case Id : ${newCase.caseId} has been registered and is at position : ${index}, please check website for future updates of your case`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: `+91${foundCase.phoneNumber}`
                });

            res.status(200).json({ message: "Case filed successfully", savedCase });
        }
        else {
            res.status(406).json({ message: "phone Number length not adequate" });
        }

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

        const { index, foundCase } = await getCasePosition(req.params.caseId);

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
};