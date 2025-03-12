import {BaseService} from "../utilities/BaseService";
import {ExpenseJson} from "./ExpenseJson";
import AppError from "../utilities/AppError";

export class ExpenseService extends BaseService {
    constructor() {
        super(ExpenseService.name);
    }

    async get(): Promise<ExpenseJson[]> {
        this.logger.log(`Get all expenses`);
        const data = await this.prisma.expense.findMany();
        return data.map((c: any) => ExpenseJson.from(c));
    };

    async getById(expenseId: number): Promise<ExpenseJson> {
        this.logger.log(`Get expense by [id:${expenseId}]`);

        const expenseData = await this.prisma.expense.findUnique({
            where: { id: expenseId }
        });

        if (!expenseData) {
            throw new AppError("Not Found", 404, `Expense with [id:${expenseId}] not found`);
        }

        return ExpenseJson.from(expenseData);
    };

    async add(expense: ExpenseJson): Promise<ExpenseJson> {
        this.logger.log(`Create new expense`, expense);
        return ExpenseJson.from(
            await this.prisma.expense.create({
                data: {
                    name: expense.getName(),
                    totalPrice: expense.getTotalPrice(),
                    date: expense.getDate(),
                    orderId: expense.getOrderId(),
                    deliveryId: expense.getDeliveryId()
                }
            })
        );
    };

    async update(expenseId: number, expense: any): Promise<ExpenseJson> {
        this.logger.log(`Update expense with [id=${expenseId}]`);

        if (expenseId != expense.getId()) {
            throw new AppError("Bad Request", 400, `Expense id mismatch`);
        }

        const existingExpense = this.getById(expenseId);

        this.logger.log(`Update existing expense`, existingExpense);
        this.logger.log(`Expense updated data`, expense);

        return ExpenseJson.from(
            await this.prisma.expense.update({
                where: { id: expenseId },
                data: {
                    name: expense.getName(),
                    totalPrice: expense.getTotalPrice(),
                    date: expense.getDate(),
                    orderId: expense.getOrderId(),
                    deliveryId: expense.getDeliveryId()
                }
            })
        );
    }

    async delete(expenseId: number): Promise<void> {
        this.logger.log(`Delete expense with [id=${expenseId}]`);
        await this.prisma.expense.delete({
            where: { id: expenseId }
        });
    }

    async deleteByOrderId(orderId: number): Promise<void> {
        this.logger.log(`Delete expense with [orderId=${orderId}]`);
        await this.prisma.expense.deleteMany({
            where: { orderId: orderId }
        });
    }
}