import express, {Request, Response} from "express";
import {OrderService} from "./OrderService";
import {OrderJson} from "./OrderJson";
import handleAsync from "../utilities/HandleAsync";

const router = express.Router();
const orderService = new OrderService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await orderService.get()
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
                    await orderService.getById(
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
                    await orderService.add(
                        OrderJson.fromObject(req.body)
                    )
                );
        }
    )
);

router.put("/:id",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await orderService.update(
                        OrderJson.fromObject(req.body),
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.put("/:id/sync-inventory",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await orderService.updateInventory(
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.put("/:id/sync-expense",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await orderService.updateExpense(
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.put("/:id/cancel-all-sync",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await orderService.cancelAllSync(
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await orderService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
