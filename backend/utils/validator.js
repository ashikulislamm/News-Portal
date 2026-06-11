import { BadRequestError } from "./appError.js";

/**
 * Validates request data based on checks and calls next() or throws BadRequestError
 */
export const validateRegister = (req, res, next) => {
  const { fullName, email, address, phone, country, password } = req.body;
  const errors = [];

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email address is required");
  }
  if (!address || address.trim() === "") {
    errors.push("Address is required");
  }
  if (!phone || phone.trim() === "") {
    errors.push("Phone number is required");
  }
  if (!country || country.trim() === "") {
    errors.push("Country is required");
  }
  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join("; ")));
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email address is required");
  }
  if (!password || password.trim() === "") {
    errors.push("Password is required");
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join("; ")));
  }
  next();
};

export const validateProfileUpdate = (req, res, next) => {
  const { fullName, email, phone } = req.body;
  const errors = [];

  if (fullName !== undefined && fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("A valid email address is required");
  }
  if (phone !== undefined && phone.trim() === "") {
    errors.push("Phone number cannot be empty");
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join("; ")));
  }
  next();
};

export const validateNewsCreate = (req, res, next) => {
  const { title, description, content, category } = req.body;
  const errors = [];

  if (!title || title.trim() === "") {
    errors.push("News title is required");
  }
  if (!description || description.trim() === "") {
    errors.push("News description is required");
  }
  if (!content || content.trim() === "") {
    errors.push("News content is required");
  }
  
  const validCategories = ["Politics", "Sports", "Technology", "Business", "Entertainment", "Health", "Education"];
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category is required and must be one of: ${validCategories.join(", ")}`);
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join("; ")));
  }
  next();
};

export const validateNewsUpdate = (req, res, next) => {
  const { category } = req.body;
  const errors = [];

  if (category !== undefined) {
    const validCategories = ["Politics", "Sports", "Technology", "Business", "Entertainment", "Health", "Education"];
    if (!validCategories.includes(category)) {
      errors.push(`Category must be one of: ${validCategories.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return next(new BadRequestError(errors.join("; ")));
  }
  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body;
  if (!content || content.trim() === "") {
    return next(new BadRequestError("Comment content is required and cannot be empty"));
  }
  next();
};
