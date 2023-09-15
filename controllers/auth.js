import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res, next) => {
  try {

    const { password, confirmPassword, ...otherDetails } = req.body;

    if(password === confirmPassword){
    const salt = bcrypt.genSaltSync(process.env.SALT);

    const hashedPassowrd = bcrypt.hashSync(password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassowrd,
    });

    await newUser.save();
    res.status(200).send("User has been created.");}
    else{
      res.status()
    }
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.empId });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      "Stack", {

      expiresIn: '1h' // expires in 1 hrs

    }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};