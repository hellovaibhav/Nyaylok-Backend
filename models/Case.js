import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
    victimName: {
        type: String,
        required: true
    },
    firNumber: {
        type: String,
    },
    policeStationName: {
        type: String,
    },
    areaPincode: {
        // this is used to determin the area of jurisdiction of the court the case is filled in or the police station where FIR was filled 
        type: Number
    },
    IPCsections:[{
        type:String,
        required:[true,"Please enter the IPC sections"],
    }],
    points:
    {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['Registered', 'Ongoing', 'Completed'],
            message: '{VALUE} is not supported'
        },
        default: "Registered",
    },
    prevCaseId: {
        type: String,
    },
    DOF:
    {
        type: Date,
        required: true
    },
    DOC: {
        type: Date,
    }
});

export default mongoose.model("Case", caseSchema);