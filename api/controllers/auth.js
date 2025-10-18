import { compareSync, genSaltSync, hashSync } from "bcrypt";
import users from "../models/users.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { generateToken } from "../utils/token.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password, cPassword } = req.body;

    email = email?.toLowerCase();
    userName = userName?.toLowerCase();

    if (!firstName || !lastName || !userName || !email || !password || !cPassword) {
      return res.status(400).json(sendError({ status: false, message: "All fields are required" }));
    }

    const existingUserByEmail = await users.findOne({ email });
    const existingUserByUsername = await users.findOne({ userName });

    if (existingUserByEmail) {
      return res.status(400).json(sendError({ status: false, message: "Email already registered" }));
    }
    if (existingUserByUsername) {
      return res.status(400).json(sendError({ status: false, message: "Username already exists" }));
    }

    if (password.length < 8) {
      return res.status(400).json(sendError({ status: false, message: "Password must be at least 8 characters" }));
    }
    if (password !== cPassword) {
      return res.status(400).json(sendError({ status: false, message: "Passwords do not match" }));
    }

    const salt = genSaltSync(10);
    const hashedPwd = hashSync(password, salt);

    const doc = new users({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPwd,
    });

    const savedUser = await doc.save();

    const userResponse = savedUser.toObject();
    delete userResponse.password;

    const token = generateToken({ data: userResponse, expiresIn: "24h" });

    return res.status(201).json(sendSuccess({
      status: true,
      message: "User successfully registered",
      token,
      data: userResponse,
    }));

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json(sendError({ status: false, message: "Internal server error" }));
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.toLowerCase();

    if (!email || !password) {
      return res.status(400).json(sendError({ status: false, message: "Missing email or password" }));
    }

    const user = await users.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json(sendError({ status: false, message: "User not found" }));
    }

    const isValid = compareSync(password, user.password);
    if (!isValid) {
      return res.status(400).json(sendError({ status: false, message: "Invalid credentials" }));
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    const token = generateToken({ data: userResponse, expiresIn: "24h" });
    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json(sendSuccess({
      status: true,
      message: "Login successful",
      token,
      data: userResponse,
    }));

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json(sendError({ status: false, message: "Internal server error" }));
  }
};
