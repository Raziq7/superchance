import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
      unique: true,
    },
    game_id: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    draw_time: {
      type: String,
      required: true,
    },
    ticket_time: {
      type: String,
      required: true,
    },
    startPoint: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending","Done","No win", "Completed"],
      default: "blank",
    },
    result: {
      type: Number,  // You can modify it based on your actual result type
      default: null,
    },
    data: [
      {
        bet: {
          type: Number,
          required: true,
        },
        played: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Bet = mongoose.model("Bet", betSchema);

export default Bet;
