import moment from "moment-timezone";
import Case from "../models/Case.js";
import { createError } from "./error.js";
import { getRedisData, setRedisData } from "./redisUtils.js";

// imported files


export const getCaseId = async () => {


    const randomNum = Math.floor((Math.random() * 899) + 100);
    const date = moment().tz("Asia/Kolkata").format('DDMMYYYYHHmmss');

    const caseNum = `${date}${randomNum}`;


    return Number(caseNum);

};

export const getCasePosition = async (myCaseId) => {
    try {

        const cacheKey= `caseId:${myCaseId}`

        const cachedData = await getRedisData(cacheKey);

        if(cachedData)
        {
            return cachedData;
        }

        const foundCase = await Case.findOne({ caseId: myCaseId });
        
        if (!foundCase) {
            const err = createError(404, "Case with this Case Id not found in database");
            throw err;
        }

        if (foundCase.status == 'Completed') {
            const number =0;
            return { number, foundCase };
        }

        const arr = await Case.find(
            {
                $or: [{ status: "Registered" }, { status: "Ongoing" }],
            }).sort({ points: -1, DOF: 1 });

        let index = arr.findIndex((element) => {
            if (element.caseId == myCaseId) {

                return element.caseId == myCaseId;
            }
        });
        index += 1;
        setRedisData(cacheKey,{index,foundCase});
        return { index, foundCase };
    } catch (err) {
        throw err; // Rethrow the error so it can be caught by the caller
    }
};