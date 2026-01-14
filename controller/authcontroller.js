const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  validateEmail,
  validatePassword,
  validateRequiredFields,
} = require("../Utils/validation");

exports.signup = async (req, res) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured!");
      return res.status(500).json({
        status: 500,
        message: "Server configuration error - JWT_SECRET missing",
      });
    }

    let { email, password, confirmPassword } = req.body;

    // Normalize email to lowercase
    if (email) {
      email = email.toLowerCase().trim();
    }

    // Validate required fields
    if (!validateRequiredFields(email, password)) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
      });
    }

    // Validate password length
    if (!validatePassword(password)) {
      return res.status(400).json({
        status: 400,
        message: "Password must be at least 6 characters long",
      });
    }

    // Validate password confirmation
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    // Hash password (cost factor 12 for better security)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (DB unique constraint handles race conditions)
    const newUser = await User.create({
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response with token
    res.status(201).json({
      status: 201,
      message: "Signup successful",
      user: {
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    
    // Handle Sequelize unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        status: 409,
        message: "User already exists",
      });
    }
    
    res.status(500).json({
      status: 500,
      message: "Signup failed",
    });
  }
};

exports.login = async (req, res) => {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured!");
      return res.status(500).json({
        status: 500,
        message: "Server configuration error - JWT_SECRET missing",
      });
    }

    let { email, password } = req.body;

    // Normalize email to lowercase
    if (email) {
      email = email.toLowerCase().trim();
    }

    // Validate required fields
    if (!validateRequiredFields(email, password)) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response
    res.status(200).json({
      status: 200,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      status: 500,
      message: "Login failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
