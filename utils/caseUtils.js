import moment from "moment-timezone";

// imported files


export const getCaseId = async () => {


    const randomNum = Math.floor((Math.random() * 999) + 100);
    const date = moment().tz("Asia/Kolkata").format('DDMMYYYYHHmmss');
    
    const caseNum = `${date}${randomNum}`;


    return caseNum;

};
