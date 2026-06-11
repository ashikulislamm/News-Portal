import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import config from "../config/config.js";
import { BadRequestError, NotFoundError } from "../utils/appError.js";

/**
 * Service to handle business rules for authentication and user profiles
 */
export const register = async (userData) => {
  const { fullName, email, address, phone, country, password } = userData;

  // Check if user already exists (by email)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Save new user
  const user = new User({
    fullName,
    email,
    address,
    phone,
    country,
    password: hashedPassword,
  });

  await user.save();
  return user;
};

export const login = async (email, password) => {
  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid credentials");
  }

  // Check password match
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Invalid credentials");
  }

  // Sign JWT token
  const token = jwt.sign(
    { userId: user._id, fullName: user.fullName },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      country: user.country,
    },
  };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new NotFoundError("User not found");
  }
  return user;
};

export const updateProfile = async (userId, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const allowedFields = ["fullName", "email", "phone", "country", "address", "bio"];
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      user[field] = updateData[field];
    }
  });

  await user.save();
  return user;
};
