import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connect from "./connect/connect.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlware.js";
import sanitizedConfig from "./config.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import { spinAndStoreResult } from "./controller/spinAndStoreResult.js";

dotenv.config();
const app = express();
const router = express.Router();

// Configure CORS, sessions, and body parsers
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  methods: ["GET", "POST", "PUT"],
  credentials: true,  // Allow cookies to be sent from the frontend
}));

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/session-db',
      ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (optional)
    }),
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax', 
    },
  })
);

// Middleware to parse body
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
connect().then(() => console.log("DB connected"));

// Ensure that the spinner runs at fixed intervals (2 minutes)
// Use a flag to prevent overlapping calls
let isSpinning = false;

const runSpinner = async () => {
  if (isSpinning) {
    console.log("Skipping spinner run, previous run is still in progress.");
    return;  // Skip this interval if the previous spinner is still running
  }

  try {
    isSpinning = true; // Lock the spinner
    console.log("Starting the spinner...");
    await spinAndStoreResult(); // Trigger the spinner logic
    console.log("Spinner finished.");
  } catch (error) {
    console.error("Error during spinner operation:", error);
  } finally {
    isSpinning = false; // Unlock the spinner after the operation is done
  }
};

// Automatically trigger the spinner every 2 minutes
setInterval(runSpinner, 2 * 60 * 1000); // 2 minutes in milliseconds

// Routes for authentication and user handling
app.use("/api/auth/", authRouter);
app.use("/api/user/", userRouter);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
