import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import macaddress from "macaddress";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const generateToken = async (req, res, next) => {
  try {

    const token = jwt.sign({ name: req.name, email: req.empId }, secret, {algorithm:'HS384', expiresIn: '1h' });

    macaddress.one((err, mac) => {
      console.log(mac);
      req.ip = mac;
    });

    await req.save();

    return token;
  } catch (err) {
    return err;
  }
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
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