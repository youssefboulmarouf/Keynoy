import express from "express";
import {addDeliveryCompany, getDeliveryCompanies, updateDeliveryCompany, getDeliveryCompanyById, deleteDeliveryCompany} from "./DeliveryCompanyService";

const router = express.Router();

router.get("/", getDeliveryCompanies);
router.get("/:id", getDeliveryCompanyById);

router.post("/", addDeliveryCompany);

router.put("/:id", updateDeliveryCompany);

router.delete("/:id", deleteDeliveryCompany);

export default router;
