import bcrypt from "bcryptjs";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// User Registration Controller
export const registerUser = async (req, res) => {
  const { fullName, email, address, phone, country, password } = req.body;

  try {
    console.log("🔧 Register request received:", req.body);
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const user = new User({
      fullName,
      email,
      address,
      phone,
      country,
      password: hashedPassword,
    });

    await user.save();
    console.log("✅ User registered:", user);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("🔥 Server error during registration:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id , fullName: user.fullName }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    // Send **only one response** with everything
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        country: user.country,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
