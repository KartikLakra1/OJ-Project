import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
dotenv.config();
import connectDB from './Utils/db.js';
import authRouter from './Routers/auth.Router.js';
import problemRoutes from "./Routers/Problem.js";
import {requireAuth} from "@clerk/clerk-sdk-node";

connectDB();
const app = express();
app.use(cors());
// console.log("🔐 Loaded Clerk Key:", process.env.CLERK_SECRET_KEY);

app.use(express.json());

app.get("/" , (req,res) => {
    res.send("<h1>Welcome to the backend OJ Project</h1>")
})

app.get("/api/debug-auth", requireAuth(), (req, res) => {
  console.log("REQ.AUTH:", req.auth);
  return res.json({ auth: req.auth });
});

app.use('/api/auth/', authRouter);
app.use("/api/problems" , problemRoutes);



app.listen(process.env.PORT_NUM || 5001 , () => {
    console.log(`Server is running on port ${process.env.PORT_NUM} `)
}) 