import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  lawyerId:  { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  rating: { type: Number, min: 1, max: 5, required: true },
  review: { type: String, trim: true },

}, { timestamps: true });

// Prevent multiple reviews from same user for same lawyer
ReviewSchema.index({ lawyerId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);