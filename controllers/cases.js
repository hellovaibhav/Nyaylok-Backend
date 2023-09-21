import moment from "moment-timezone";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// import files
import Case from "../models/Case.js";
import { getCaseId, getCasePosition } from "../utils/caseUtils.js";
import { totalPoints } from "../utils/algorithm.js";
import { verifyAdmin, verifyToken } from "../utils/token.js";
import { createError } from "../utils/error.js";

export const registerCase = async (req, res, next) => {
    try {
        await verifyToken(req, res, async (err) => {
            if (err) {
                return res.status(401).json({ message: err.message });
            }

            const caseNum = await getCaseId();

            const newCase = new Case({
                victimName: req.body.victim,
                firNumber: req.body.fir,
                policeStationName: req.body.policeStation,
                areaPincode: req.body.pincode,
                phoneNumber: req.body.phone,
                IPCsections: req.body.ipc,
                prevCaseId: req.body.prevCaseId,
                caseId: caseNum
            });

            const score = await totalPoints(newCase.IPCsections, newCase.points);

            newCase.points = score.points;

            const numLength = newCase.phoneNumber.toString().length;

            if (numLength == 10) {

                const savedCase = await newCase.save();
                const { index, foundCase } = await getCasePosition(caseNum);

                try {
                    await client.messages
                        .create({
                            body: `Dear ${newCase.victimName}, Your case with Case Id : ${newCase.caseId} has been registered and is at position : ${index}, please check website for future updates of your case`,
                            from: process.env.TWILIO_PHONE_NUMBER,
                            to: `+91${foundCase.phoneNumber}`
                        })
                } catch (err) {
                    await Case.deleteOne({ caseId: savedCase.caseId });
                    // console.log(err);
                    return res.status(err.status).json({ message: `Your case has not been filed. We are using a free Twilio account which restricts us from sending messages to unverified Phone number,Twilio is a paid service and uses these kinds of techniques to attract customers as well as to prevent anyone from using their service for spamming, you can read more about this on ${err.moreInfo}` })
                }
                return res.status(200).json({ message: "Case filed successfully", savedCase });
            }
            else {
                res.status(406).json({ message: "phone Number length not adequate" });
            }

        });
    } catch (err) {
        res.status(404).json({ message: err });
    };
};

export const getIncompleteCases = async (req, res, next) => {
    try {
        await verifyToken(req, res, async (err) => {

            if (err) {

                return res.status(err.status).json({ message: err.message });
            }
            const cases = await Case.find(
                {
                    $or: [{ status: "Registered" }, { status: "Ongoing" }],
                }).sort({ points: -1, DOF: 1 });

            if (!cases) {
                return res.status(200).json({ messages: "No Registered or Ongoing Cases found" });
            }

            return res.status(200).json({ message: `successfull found ${cases.length} cases`, cases });

        });
    }
    catch (err) {
        console.log(err.status, err.message);
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
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
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};

export const updateCase = async (req, res, next) => {
    try {
        await verifyToken(req, res, async (err) => {
            if (err) {
                return res.status(err.status).json({ message: err.message });
            }
            const updatedCase = await Case.findOneAndUpdate({ caseId: req.params.caseId }, {

                victimName: req.body.victim,
                firNumber: req.body.fir,
                IPCsections: req.body.ipcs,
                prevCaseId: req.body.prevCaseId

            }, { new: true });

            if (!updatedCase) {
                return res.status(404).json({ message: "No case with provided Case Id was found" });
            }


            res.status(200).json({ message: "case updated succefully", updatedCase });
        });
    } catch (err) {
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};

export const getIncompleteCasesPaginated = async (req, res, next) => {
    try {
        await verifyToken(req, res, async (err) => {
            if (err) {
                return res.status(err.status).json({message : err.message});
            }
            // Calculate offset based on the page and pageSize
            const pageLimit = req.query.pageLimit || 7;
            const pages = req.query.page;


            const offset = (pages - 1) * pageLimit;

            // Your database query to retrieve a paginated subset of incomplete cases
            const paginatedCases = await Case.find({
                $or: [{ status: "Registered" }, { status: "Ongoing" }],
            }).sort({ points: -1, DOF: 1 }).skip(offset).limit(pageLimit);

            res.status(200).json({ message: "here are your paginated cases", paginatedCases });
        });
    } catch (err) {
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};

export const variousCaseCount = async (req, res) => {
    try {
        const registeredCases = await Case.find({ status: "Registered" });
        const ongoingCases = await Case.find({ status: "Ongoing" });
        const completedCases = await Case.find({ status: "Completed" });

        const response = [{ "Registered Cases": registeredCases.length },
        { "Ongoing Cases": ongoingCases.length },
        { "Completed Cases": completedCases.length }];

        res.status(200).json({ response });
    }
    catch (err) {
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};

export const upgradeToOngoing = async (req, res, next) => {

    try {
        await verifyToken(req, res, async (err) => {
            if (err) {
                // Handle authentication error here
                return res.status(401).json({ message: err.message });
            }

            const foundCase = await Case.findOneAndUpdate({ caseId: req.params.caseId }, { status: "Ongoing" }, { new: true });

            res.status(200).json({ message: `Case number : ${foundCase.caseId}'s status has been upgraded to ${foundCase.status}` });
        });
    } catch (err) {
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};


export const upgradeToCompleted = async (req, res, next) => {

    try {
        await verifyAdmin(req, res, async (err) => {
            if (err) {
                // Handle authentication error here
                return res.status(401).json({ message: err.message });
            }

            const foundCase = await Case.findOneAndUpdate({ caseId: req.params.caseId }, { status: "Completed" }, { new: true });

            res.status(200).json({ message: `Case number : ${foundCase.caseId}'s status has been upgraded to ${foundCase.status}` });
        });
    } catch (err) {
        const errorCode = err.status || 404;
        const errorMessage = err.message || "Something went wrong";
        res.status(errorCode).json({ message: errorMessage });
    }
};