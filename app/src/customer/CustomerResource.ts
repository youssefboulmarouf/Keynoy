import express from "express";
import {addCustomer, getCustomerById, deleteCustomer, getCustomers, updateCustomer} from "./CustomerService";

const router = express.Router();

router.get("/", getCustomers);
router.get("/:id", getCustomerById);

router.post("/", addCustomer);

router.put("/:id", updateCustomer);

router.delete("/:id", deleteCustomer);

export default router;
