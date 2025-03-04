import express from "express";
import {getExpenseById, getExpenses, addExpense, deleteExpense, updateExpense} from "./ExpenseService";

const router = express.Router();

router.get("/", getExpenses);
router.get("/:id", getExpenseById);

router.post("/", addExpense);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

export default router;
