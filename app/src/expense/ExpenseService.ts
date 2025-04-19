import {BaseService} from "../utilities/BaseService";
import {ExpenseJson} from "./ExpenseJson";
import NotFoundError from "../utilities/errors/NotFoundError";
import BadRequestError from "../utilities/errors/BadRequestError";

export class ExpenseService extends BaseService {
    constructor() {
        super(ExpenseService.name);
    }

    async get(): Promise<ExpenseJson[]> {
        this.logger.log(`Get all expenses`);
        const data = await this.prisma.expense.findMany();
        return data.map(c => ExpenseJson.from(c));
    };

    async getById(id: number): Promise<ExpenseJson> {
        this.logger.log(`Get expense by [id:${id}]`);
        const expenseData = await this.prisma.expense.findUnique({
            where: { id }
        });

        NotFoundError.throwIf(!expenseData, `Expense with [id:${id}] not found`);

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
                    orderId: expense.getOrderId()
                }
            })
        );
    };

    async update(id: number, expense: ExpenseJson): Promise<ExpenseJson> {
        this.logger.log(`Update expense with [id=${id}]`);

        BadRequestError.throwIf(id != expense.getId(), `Expense id mismatch`);

        const existingExpense = await this.getById(id);

        this.logger.log(`Update existing expense`, existingExpense);
        this.logger.log(`Expense updated data`, expense);

        return ExpenseJson.from(
            await this.prisma.expense.update({
                where: { id },
                data: {
                    name: expense.getName(),
                    totalPrice: expense.getTotalPrice(),
                    date: expense.getDate(),
                    orderId: expense.getOrderId()
                }
            })
        );
    }

    async delete(id: number): Promise<void> {
        this.logger.log(`Delete expense with [id=${id}]`);
        await this.prisma.expense.delete({
            where: { id }
        });
    }

    async deleteByOrderId(orderId: number): Promise<void> {
        this.logger.log(`Delete expense with [orderId=${orderId}]`);
        await this.prisma.expense.deleteMany({
            where: { orderId }
        });
    }
}