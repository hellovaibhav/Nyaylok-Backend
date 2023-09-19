import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    empId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
    },
    secretToken: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      requried: true,
      default: false,
    },
  },
  { timestamp: true }
);

export default mongoose.model("User", userSchema);
