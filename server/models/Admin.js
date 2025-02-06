import mongoose from "mongoose";

// Define the user schema
const adminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true }, // Email is required and must be unique
    password: { type: String,required:true }, // Password for traditional authentication
    logedInWith: { type: String }, // Tracks how the admin logged in: 'google', 'facebook', etc.
    isActive: { type: Boolean, default: true }, // Active by default
    isLoginEnabled: { type: Boolean, default: true }, // Enable login by default
  },
  { timestamps: true }
);

// Ensure unique combination of email and phone
adminSchema.index({ email: 1 });

// Create and export the admin model
export default mongoose.model("admin", adminSchema);
