import moment from "moment-timezone";
import Case from "../models/Case.js";

// imported files


export const getCaseId = async () => {


    const randomNum = Math.floor((Math.random() * 899) + 100);
    const date = moment().tz("Asia/Kolkata").format('DDMMYYYYHHmmss');

    const caseNum = `${date}${randomNum}`;


    return Number(caseNum);

};

export const getCasePosition = async (caseId) => {
    try {

        const arr = await Case.find();
        let foundCase;
        const index = arr.findIndex((element) => {
            if (element.caseId == caseId) {
                foundCase = element;
                return element.caseId == caseId;
            }
        });

        return { index, foundCase };
    } catch (err) {
        throw err; // Rethrow the error so it can be caught by the caller
    }
};