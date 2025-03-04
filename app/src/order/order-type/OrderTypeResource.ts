import express from "express";
import {getOrderTypeById, getOrderTypes, addOrderType, deleteOrderType, updateOrderType} from "./OrderTypeService";

const router = express.Router();

router.get("/", getOrderTypes);
router.get("/:id", getOrderTypeById);

router.post("/", addOrderType);

router.put("/:id", updateOrderType);

router.delete("/:id", deleteOrderType);

export default router;
