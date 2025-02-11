import mongoose from "mongoose";

const betSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
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
    endId: {
      type: String,
      // required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Done", "No win", "Completed", "blank"],
      default: "blank",
    },
    result: {
      type: Number,
      default: null,
    },
    isAutoClaim: {
      type: Boolean,
      required: true,
    },
    unclaimedAmount: {
      type: Number,
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
        won: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalPlayed: {
      type: Number,
      required: true,
      default: 0,
    },
    won: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Bet = mongoose.model("Bet", betSchema);

export default Bet;
