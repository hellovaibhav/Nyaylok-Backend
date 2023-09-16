import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import macaddress from "macaddress";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const secret = process.env.JWT_SECRET;


export const generateToken = async (req, res, next) => {
  try {

    const token = jwt.sign({ name: req.name, empId: req.empId }, secret, { algorithm: 'HS384', expiresIn: '1h' });

    macaddress.one((err, mac) => {
      req.ip = mac;
    });

    await req.save();

    return token;
  } catch (err) {
    return err;
  }
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.nyayToken;

  console.log(token);

  if (!token) {
    next(createError(401, "You are not authenticated!"));
  }

  let verificationIp;

  macaddress.one((err, mac) => {
    verificationIp = mac;
  });

  jwt.verify(token, secret, async (err, user) => {
    if (err) { return next(createError(403, "Token is not valid!")); }


    req.user = user;

    const foundUser = await User.findOne({ empId: req.user.empId });

    if (foundUser.ip !== verificationIp) { return next(createError(403, "User needs to login again!")); }

    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      throw err(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};