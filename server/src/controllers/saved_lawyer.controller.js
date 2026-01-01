// src/controllers/saved_lawyer.js

import User from "../models/user.model.js"
import Lawyer from "../models/lawyer.model.js";

export const savedLawyerLoader = async (req, res) => {
  try {
    const userId = req.client_data.id;

    // 1. Fetch user to get saved lawyer IDs
    const user = await User.findById(userId)
      .select("saved_lawyers first_name")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user);
    const name= user.first_name;
    console.log(name);

    const savedIds = user.saved_lawyers || [];

    if (savedIds.length === 0) {
      return res.json({ saved_lawyers: [],name });
    }

    // 2. Get all lawyers in one query (project only needed fields)
    const lawyers = await Lawyer.find(
      { _id: { $in: savedIds } },
      {
        first_name: 1,
        last_name:1,
        profile_picture: 1,
        specialities: 1,
        review_count: 1,
      }
    ).lean();

    // 3. Preserve order same as saved_lawyers array
    const orderMap = new Map(savedIds.map((id, index) => [String(id), index]));

    lawyers.sort(
      (a, b) =>
        orderMap.get(String(a._id)) - orderMap.get(String(b._id))
    );

    // 4. Format all card objects cleanly
    const formatted = lawyers.map(l => ({
      id: String(l._id),
      name: l.first_name+" "+l.last_name,
      profile_pic: l.profile_picture,
      speciality: Array.isArray(l.specialities) ? l.specialities[0] : "",
      review_count: l.review_count || 0,
    }));

    // 5. Send final response
    return res.json({ saved_lawyers: formatted,
      name:name
     });
    
  } catch (err) {
    console.error("Error loading saved lawyers:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const saveLawyer = async (req, res) => {
  const userId = req.client_data.id; // from auth middleware
  const { lawyerId } = req.params;

  await User.findByIdAndUpdate(
    userId,
    { $addToSet: { saved_lawyers: lawyerId } }, // avoids duplicates
    { new: true }
  );

  res.json({ saved: true });
};


export const unsaveLawyer = async (req, res) => {
  const userId = req.client_data.id;
  const { lawyerId } = req.params;

  await User.findByIdAndUpdate(
    userId,
    { $pull: { saved_lawyers: lawyerId } },
    { new: true }
  );

  res.json({ saved: false });
};


export const isLawyerSaved = async (req, res) => {
  const userId = req.client_data.id;
  const { lawyerId } = req.params;

  const user = await User.findById(userId).select("saved_lawyers");

  const save = user.saved_lawyers.includes(lawyerId);
  res.json({ saved:save });
};