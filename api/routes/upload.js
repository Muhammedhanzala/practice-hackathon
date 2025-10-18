import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// ✅ Upload file (image/pdf etc.)
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "hackathon_uploads", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(fileBuffer);
    });

    res.status(200).json({
      message: "File uploaded successfully ✅",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

export default router;