import mongoose from "mongoose";

const LawyerSchema = new mongoose.Schema({
  first_name: { type: String, required: true, trim: true },
  last_name:  { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, lowercase: true },
  password_hash: { type: String, required: true },  // hashed

  profile_picture: { type: String, default: "" },

  experience: {
    type: String,
    enum: ["1+", "2+", "3+", "5+", "10+", "15+", "20+", "25+", "30+"],
    required: true
  },

  // Requested address fields
  city:    { type: String, trim: true },
  state:   { type: String, trim: true },
  office_address: { type: String, trim: true },
  pincode: { type: String, trim: true }, // store as string to preserve leading zeros

 
  bar_license:    { type: String, required: true, unique: true },
  AOR_certified: {type: Boolean},

  // Court eligibility (3 booleans)
  court_eligibility:{ 
    type: {
      district_court: { type: Boolean, default: false },
      high_court: { type: Boolean, default: false },
      supreme_court: { type: Boolean, default: false }
    }
    
  },

  languages:     [{ type: String }],
  specialities:  [{ type: String }],

  description: { type: String, trim: true },

  

  // Rating summary
  avg_rating:    { type: Number, default: 0 },
  review_count: { type: Number, default: 0 },

  featured:{
    value: {type: Boolean, default: false},
    rank:{type: Number, default:0},
    expire_date:{type: Date},
  },

}, { timestamps: true });

// Index for faster search by city/state/language
LawyerSchema.index({ city: 1, state: 1 });
LawyerSchema.index({ specialities: 1 });
LawyerSchema.index({ languages: 1 });
LawyerSchema.index({court_eligibility:1});

const Lawyer= mongoose.model("Lawyer", LawyerSchema)
export default Lawyer;