import express from "express";
import protect from "../middleware/authMiddleware.js";
import admin from "../middleware/adminMiddleware.js";
import {addOrderItems, getOrders, getMyOrders, updateOrderStatus} from "../controllers/orderController.js";

const router=express.Router();

router.route('/').post(protect,addOrderItems).get(protect,admin,getOrders);
router.route('/myorders').get(protect,getMyOrders)
router.route('/:id/status').put(protect,admin,updateOrderStatus);

export default router;