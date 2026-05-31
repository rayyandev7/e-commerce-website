import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./model/User.js";
import Product from "./model/Product.js";
import Order from "./model/Order.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  console.log("No dummy seed data is defined. Provide your real production data manually or via a custom import script.");
};

const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
