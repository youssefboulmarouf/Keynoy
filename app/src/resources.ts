import express, { Request, Response } from "express";
import ProductResource from "./product/ProductResource";
import ProductTypeResource from "./product/product-type/ProductTypeResource";
import OrderResource from "./order/OrderResource";
import ExpenseResource from "./expense/ExpenseResource";
import ShippingResource from "./shipping/ShippingResource";
import CompanyResource from "./company/CompanyResource";
import ColorResource from "./color/ColorResource";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Keynoy backend is running!");
});

router.use("/orders", OrderResource);
router.use("/shipping", ShippingResource);
router.use("/products", ProductResource);
router.use("/product-types", ProductTypeResource);
router.use("/colors", ColorResource);
router.use("/expenses", ExpenseResource);
router.use("/companies", CompanyResource);

export default router;