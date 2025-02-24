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
import spinnerRouter from "./routes/spinnerRouter.js"
import { runSpinner } from './controller/spinAndStoreResult.js'; // Import the runSpinner function


dotenv.config();
const app = express();
const router = express.Router();

// Configure CORS, sessions, and body parsers
app.use(cors({
  origin: "http://localhost:5173",  // Your frontend URL
  methods: ["GET", "POST", "PUT", "PATCH"],
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

// Call runSpinner to ensure spinner starts at intervals as soon as the server starts
// runSpinner(); // Call this function to start the spinner process immediately


// Routes for authentication and user handling
app.use("/api/auth/", authRouter);
app.use("/api/user/", userRouter);
app.use("/api/spinner/",spinnerRouter)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
