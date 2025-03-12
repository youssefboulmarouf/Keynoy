import express, {Request, Response} from "express";
import {ExpenseJson} from "./ExpenseJson";
import {ExpenseService} from "./ExpenseService";
import handleAsync from "../utilities/HandleAsync";

const router = express.Router();
const expenseService = new ExpenseService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await expenseService.get()
                );
        }
    )
);

router.get("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await expenseService.getById(
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.post("/",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await expenseService.add(
                        ExpenseJson.from(req.body)
                    )
                );
        }
    )
);

router.put("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await expenseService.update(
                        Number(req.params.id),
                        ExpenseJson.from(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await expenseService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
