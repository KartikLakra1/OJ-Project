import mongoose from 'mongoose';
import express from 'express';
import { registerUser } from '../Controllers/auth.controllers.js';


const authRouter = express.Router();

authRouter.post('/signup' , registerUser);

export default authRouter;