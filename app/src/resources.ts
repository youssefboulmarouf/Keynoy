import express, { Request, Response } from "express";
import ProductResource from "./product/ProductResource";
import ProductTypeResource from "./product/product-type/ProductTypeResource";
import SupplierResource from "./supplier/SupplierResource";
import CustomerResource from "./customer/CustomerResource";
import DeliveryCompanyResource from "./delivery/DeliveryCompanyResource";
import OrderResource from "./order/OrderResource";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Keynoy backend is running!");
});

router.use("/orders", OrderResource);
router.use("/products", ProductResource);
router.use("/product-types", ProductTypeResource);
router.use("/suppliers", SupplierResource);
router.use("/customers", CustomerResource);
router.use("/delivery-companies", DeliveryCompanyResource);

export default router;