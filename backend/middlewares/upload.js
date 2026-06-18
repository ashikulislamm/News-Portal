import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../config/config.js";
import { BadRequestError } from "../utils/appError.js";

// Ensure upload directory exists
if (!fs.existsSync(config.uploadDir)) {
  fs.mkdirSync(config.uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestError("Only image files (.jpg, .jpeg, .png, .webp, .gif) are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

// Configure fields for multi-file upload compatible with current schema
export const uploadFields = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// Helper wrapper to catch multer errors (e.g. limit errors) and pass them as Bad Request
export const handleUploadFields = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new BadRequestError(`File is too large. Max limit is ${config.maxFileSize / (1024 * 1024)}MB.`));
      }
      return next(new BadRequestError(`File upload error: ${err.message}`));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

// Configure single image upload for the editor
const uploadSingleImage = upload.single("image");

export const handleSingleUpload = (req, res, next) => {
  uploadSingleImage(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new BadRequestError(`File is too large. Max limit is ${config.maxFileSize / (1024 * 1024)}MB.`));
      }
      return next(new BadRequestError(`File upload error: ${err.message}`));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

