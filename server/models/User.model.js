import mongoose from "mongoose";

// User Schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0, 
    },
    isActive: {
      type: Boolean,
      default: false,  // Assuming users are active by default
    },
  },
  { timestamps: true }
);

// Method to compare password (optional, depending on your needs)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return enteredPassword === this.password;
};

export default mongoose.model('User', userSchema);
