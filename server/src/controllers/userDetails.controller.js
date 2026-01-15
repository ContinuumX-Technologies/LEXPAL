import User from "../models/user.model.js";
import Lawyer from "../models/lawyer.model.js";
const getName = async (req, res) => {
  try {
    const { id, user_type } = req.client_data;

    let user;

    if (user_type == "User") {
      user = await User.findById(id)
        .select("first_name last_name")
        .lean();

    }
    else {
      user = await Lawyer.findById(id)
        .select("first_name last_name")
        .lean();
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      name: user.first_name,
      last_name: user.last_name
    });

  } catch (err) {
    console.error("Error loading user details:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const setHasSeenWalkthrough = async (req, res) => {
  try {
    const { id } = req.client_data;
    await User.findByIdAndUpdate(id, { has_seen_dashboard_walkthrough: true });
    return res.json({ success: true });
  } catch (err) {
    console.error("Error setting walkthrough seen:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default getName;