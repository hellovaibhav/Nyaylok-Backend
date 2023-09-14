import express from "express";
import Case from "../models/Case.js";

export const registerCase = (req, res, next) => {
    const dateNow = new Date().toLocaleString("en-IN", { timeZone: "IST" });

    console.log(dateNow.split(",")[0]);

    console.log(req.body);

    try {
        const newCase = new Case({
            victimName: req.body.victim,
            firNumber: req.body.fir,
            policeStationName: req.body.policeStation,
            areaPincode: req.body.pincode,
            IPCsections: req.body.IPCs,
            prevCaseId: req.body.prevCaseId,
            DOF: dateNow,
        });

        console.log(IPCsections);
        res.status(200).json({ message: "User is created successfully", newCase });
    } catch (err) {
        next(err);
    };
};