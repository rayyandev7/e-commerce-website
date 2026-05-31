import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import analyticRoutes from "./routes/analyticRoutes.js";

dotenv.config();
connectDB();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/analytics',analyticRoutes);


app.get("/",(req,res)=>{
    res.json({ status: "ok", message: "E-Commerce API is running" });
})

const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`);
})