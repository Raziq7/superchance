import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import session from 'express-session';
import MongoStore from 'connect-mongo';

import connect from "./connect/connect.js"
import { errorHandler, notFound } from "./middlewares/errorMiddlware.js";

import sanitizedConfig from "./config.js";
import authRouter from "./routes/authRouter.js";
dotenv.config();
const app = express();

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


// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




// db Connectig
connect().then(() => console.log("DB connected"));


app.use("/api/auth/", authRouter);



app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use(notFound);
app.use(errorHandler);

const PORT = sanitizedConfig.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));