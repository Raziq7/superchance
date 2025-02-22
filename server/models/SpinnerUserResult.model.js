import mongoose from "mongoose";

// Define the spinner result schema
const SpinnerUserResult = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    spinnerNumber: {
      type: Number,
      required: true,
    },
    time:{
      type:String,
      required:true
    },
    dateTime: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true }
);

// Create and export the model
const userSpinnerResult = mongoose.model("SpinnerUserResult", SpinnerUserResult);
export default userSpinnerResult;
