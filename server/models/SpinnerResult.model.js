import mongoose from "mongoose";

// Define the spinner result schema
const spinnerResultSchema = new mongoose.Schema(
  {
    spinnerNumber: {
      type: Number,
      required: true,
    },
    time: {
      type: String, // Store as "12:30 AM"
      required: true,
    },
    timeInMinutes: {
      type: Number, // Store as 750 (12:30 AM = 750 minutes since midnight)
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create and export the model
const SpinnerResult = mongoose.model("SpinnerResult", spinnerResultSchema);
export default SpinnerResult;
