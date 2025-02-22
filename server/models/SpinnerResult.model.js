import mongoose from "mongoose";

// Define the spinner result schema
const spinnerResultSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Reference to the User model
    //   required: true,
    // },
    spinnerNumber: {
      type: Number,
      required: true,
    },
    time:{
      type:String,
      required:true
    },
    // Adding a custom date and time field
    dateTime: {
      type: Date,
      default: Date.now, // Set the default value to the current time when the document is created
    },
  },
  { timestamps: true } // This adds the `createdAt` and `updatedAt` fields automatically
);

// Create and export the model
const SpinnerResult = mongoose.model("SpinnerResult", spinnerResultSchema);
export default SpinnerResult;
