import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },

  profile_picture: { type: String, default: "" },

  state: { type: String, trim: true },
  city: { type: String, trim: true },
  has_seen_dashboard_walkthrough: { type: Boolean, default: false },


  saved_lawyers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer" }
  ]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;