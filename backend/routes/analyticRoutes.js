import express from "express";
import admin from "../middleware/adminMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import getAdminStats from "../controllers/analyticController.js";

const router=express.Router();

router.get('/',protect,admin,getAdminStats);

export default router;