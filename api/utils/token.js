import dotenv from "dotenv";
import pkg from "jsonwebtoken";

const { sign, verify } = pkg;

dotenv.config();

export const generateToken = ({ data, expiresIn = "24h" }) => {
  return sign(
    { id: data._id, email: data.email },
    process.env.JWT,
    { expiresIn }
  );
};

// If you later want to re-enable email OTPs, reintroduce a dedicated module
// that handles nodemailer and calling logic. For now OTP/email-sending is removed.
