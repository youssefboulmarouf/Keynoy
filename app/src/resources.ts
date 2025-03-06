import express, { Request, Response } from "express";
import ProductResource from "./product/ProductResource";
import ProductTypeResource from "./product/product-type/ProductTypeResource";
import SupplierResource from "./supplier/SupplierResource";
import CustomerResource from "./customer/CustomerResource";
import DeliveryCompanyResource from "./delivery/DeliveryCompanyResource";
import OrderStatusResource from "./order/order-status/OrderStatusResource";
import OrderResource from "./order/OrderResource";
import ColorResource from "./product/color/ColorResource";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Keynoy backend is running!");
});

router.use("/orders", OrderResource);
router.use("/order-status", OrderStatusResource);

router.use("/products", ProductResource);
router.use("/product-types", ProductTypeResource);
router.use("/colors", ColorResource);

router.use("/suppliers", SupplierResource);

router.use("/customers", CustomerResource);

router.use("/delivery-companies", DeliveryCompanyResource);

export default router;