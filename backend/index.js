import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './Utils/db.js';
import authRouter from './Routers/auth.Router.js';

connectDB();
const app = express();
app.use(express.json());

app.get("/" , (req,res) => {
    res.send("<h1>Welcome to the backend OJ Project</h1>")
})

app.use('/api/auth/', authRouter);



app.listen(process.env.PORT_NUM || 5001 , () => {
    console.log(`Server is running on port ${process.env.PORT_NUM} `)
}) 