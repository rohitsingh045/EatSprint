import express from "express"
import { placeOrder, userOrders, verifyOrder, listOrders, updateStatus, cancelOrder } from "../controllers/orderController.js"
import authMiddleware from "../middleware/auth.js";

const orderRouter = express.Router();

// REMOVE authMiddleware here:
orderRouter.post("/place",authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder)
orderRouter.post("/user-orders",authMiddleware,userOrders)
orderRouter.get('/list',listOrders)
orderRouter.post('/status',updateStatus)
orderRouter.post('/cancel',authMiddleware, cancelOrder)
export default orderRouter;