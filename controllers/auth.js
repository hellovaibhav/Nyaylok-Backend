import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import macaddress from "macaddress";
import dotenv from "dotenv";

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
      res.status(200).send("User has been created.");
    }
    else {
      res.status(403).send("confirm password dosen't match");
    }
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {

    

    const user = await User.findOne({ empId: req.body.empId });


    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user.empId, name: user.name },
      process.env.JWT_SECRET,
      {
        algorithm: 'HS384',
        expiresIn: '1h'
      }
    );

    macaddress.one((err, mac) => {
      user.ip = mac;
    });

    await user.save();

    const { password, isAdmin, secretToken, ...otherDetails } = user._doc;
    res.cookie("nyayToken", token, {
      httpOnly: true,
    })
      .status(200)
      .json({ message: `${user.name} you have been logged in`, details: { ...otherDetails } });
  } catch (err) {
    next(err);
  }
};