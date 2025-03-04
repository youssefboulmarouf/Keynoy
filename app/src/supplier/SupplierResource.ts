import express from "express";
import {getSupplierById, getSuppliers, addSupplier, updateSupplier, deleteSupplier} from "./SupplierService";

const router = express.Router();

router.get("/", getSuppliers);
router.get("/:id", getSupplierById);

router.post("/", addSupplier);

router.put("/:id", updateSupplier);

router.delete("/:id", deleteSupplier);

export default router;
