import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import dotenv from "dotenv";
import { generateToken } from "../utils/token.js";

dotenv.config();

export const register = async (req, res, next) => {
  try {
    const { password, confirmPassword, ...otherDetails } = req.body;

    if (password === confirmPassword) {
      const salt = bcrypt.genSaltSync(Number(process.env.SALT));

      const hashedPassowrd = bcrypt.hashSync(password, salt);

      const newUser = new User({
        ...req.body,
        password: hashedPassowrd,
      });

      await newUser.save();
      res.status(200).json({ message: "User has been created." });
    } else {
      res.status(403).json({ message: "confirm password dosen't match" });
    }
  } catch (err) {
    const errorCode = err.status || 404;
    const errorMessage = err.message || "Something went wrong";
    res.status(errorCode).json({ message: errorMessage });
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ empId: req.body.empId });

    if (!user) throw (createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect)
      throw createError(400, "Wrong password or username!");

    const { token, userToken } = await generateToken(user);
    const { password, isAdmin, secretToken, ip, ...otherDetails } = user._doc;
    res
      .cookie("nyayToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        expires: new Date(Date.now() + 4 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        message: `${user.name} you have been logged in`,
        details: { ...otherDetails },
        value: userToken,
      });
  } catch (err) {
    const errorCode = err.status || 404;
    const errorMessage = err.message || "Something went wrong";
    res.status(errorCode).json({ message: errorMessage });
  }
};

export const logout = async (req, res, next) => {
  res.clearCookie("nyayToken").json({ message: "User has been logged out successfully" });
};