import express from "express";
import {addProduct, getProducts, getProductById, updateProduct, deleteProduct} from "./ProductService";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;
