// controllers/upload.controller.js

import cloudinary from "../infra/cloudinary.js";
import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";

export const profilePicUploader = async (req, res) => {
  try {
   
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

   
    const { id, role } = req.client_data;  
   

    // 3. Convert file buffer → base64 string
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // 4. Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "lexpal_profile_pics",
      resource_type: "image"
    });

    // 5. Store the URL in DB
    let updatedDoc = null;

    if (role === "user") {
      updatedDoc = await User.findByIdAndUpdate(
        id,
        { profile_picture: uploadResult.secure_url },
        { new: true }
      );
    } 
    else if (role === "lawyer") {
      updatedDoc = await Lawyer.findByIdAndUpdate(
        id,
        { profile_picture: uploadResult.secure_url },
        { new: true }
      );
    } 
    else {
      return res.status(400).json({ message: "Invalid role in token" });
    }

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      profile_picture: uploadResult.secure_url,
      updated: updatedDoc
    });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};