import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";

/**
 * GET /api/users/:id
 * Returns profile info for chat header
 */
export async function getChatProfile(req, res) {
  try {
    const requesterRole = req.client_data.user_type;
    const targetId = req.params.id;

    console.log(requesterRole);

    let profile;

    if (requesterRole === "User") {
      // User chatting with Lawyer
      console.log("getting lawyer profile")
      profile = await Lawyer.findById(targetId).select(
        "first_name last_name profile_picture"
      );
      console.log(profile);
    } else if (requesterRole === "Lawyer") {
      // Lawyer chatting with User
      profile = await User.findById(targetId).select(
        "first_name last_name profile_picture"
      );
    }

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json({
      _id: profile._id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      profile_pic: profile.profile_picture,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error"} );
  }
}