import express from "express";
import {addProductType, getProductTypeById, updateProductType, getProductTypes, deleteProductType} from "./ProductTypeService";

const router = express.Router();

router.get("/", getProductTypes);
router.get("/:id", getProductTypeById);

router.post("/", addProductType);

router.put("/:id", updateProductType);

router.delete("/:id", deleteProductType);

export default router;
