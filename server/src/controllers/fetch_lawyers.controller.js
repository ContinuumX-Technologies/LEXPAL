
import Lawyer from "../models/lawyer.model.js";

export const fetchLawyers = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 6;
        const cursor = req.query.cursor;

        const query = cursor
            ? { _id: { $gt: cursor } }
            : {};

        const data = await Lawyer.find(query)
            .sort({ _id: 1 })
            .limit(limit + 1); // fetch one extra

        const lawyers = data.map((d) => ({
            id: d._id,
            first_name: d.first_name,
            last_name: d.last_name,
            experience: d.experience,
            avg_rating: d.avg_rating,
            review_count: d.review_count,
            languages: d.languages,
            specialities: d.specialities,
            court_eligibility: d.court_eligibility,
            profile_picture: d.profile_picture

        }));

        const hasMore = lawyers.length > limit;

        if (hasMore) lawyers.pop();

        const nextCursor = lawyers.length
            ? lawyers[lawyers.length - 1]._id
            : null;

        res.json({
            lawyers,
            nextCursor,
            hasMore
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lawyers" });
    }
};



export const fetchLawyerById = async (req, res) => {
  try {
    const { lawyerId } = req.params;

    if (!lawyerId) {
      return res.status(400).json({ error: "Lawyer ID is required" });
    }

    const lawyer = await Lawyer.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    res.status(200).json(lawyer);
  } catch (error) {
    console.error("Fetch lawyer error:", error);

    // Invalid ObjectId case
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid lawyer ID format" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};