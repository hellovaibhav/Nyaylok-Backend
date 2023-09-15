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
    IPCsections: [{
        type: String,
        // required:true,
    }],
    points:
    {
        type: Number,
        default: 0,
        required: true
    },
    phoneNumber:{
        type:Number,
        required:true
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
    DOR:
    {
        type: Date,
        default: Date.now(),
        required: true
    },
    DOC: {
        type: Date,
    }, 
    caseId: {
        type: Number,
        required:true,
        unique:true
    }
});

export default mongoose.model("Case", caseSchema);