import express from "express";
import {getOrderById, getOrders, addOrder, deleteOrder, updateOrder} from "./OrderService";

const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);

router.post("/", addOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;
