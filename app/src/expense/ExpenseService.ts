import {BaseService} from "../utilities/BaseService";
import {ExpenseJson} from "./ExpenseJson";

export class ExpenseService extends BaseService {
    constructor() {
        super();
    }

    async get(): Promise<ExpenseJson[]> {
        const data = await this.prisma.expense.findMany();
        return data.map((c: any) => ExpenseJson.from(c));
    };

    async getById(expenseId: number): Promise<ExpenseJson> {
        return ExpenseJson.from(
            await this.prisma.expense.findUnique({
                    where: { id: expenseId }
            })
        );
    };

    async add(expense: ExpenseJson): Promise<ExpenseJson> {
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
        await this.prisma.expense.delete({
            where: { id: expenseId }
        });
    }

    async deleteByOrderId(orderId: number): Promise<void> {
        await this.prisma.expense.deleteMany({
            where: { orderId: orderId }
        });
    }
}