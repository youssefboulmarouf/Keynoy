import express from "express";
import {addOrderStatus, deleteOrderStatus, updateOrderStatus, getOrderStatusById, getOrderStatuses} from "./OrderStatusService";

const router = express.Router();

router.get("/", getOrderStatuses);
router.get("/:id", getOrderStatusById);

router.post("/", addOrderStatus);

router.put("/:id", updateOrderStatus);

router.delete("/:id", deleteOrderStatus);

export default router;
