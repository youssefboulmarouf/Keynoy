import express, {Request, Response} from "express";
import {OrderService} from "./OrderService";
import {OrderJson} from "./OrderJson";
import handleAsync from "../utilities/HandleAsync";
import {orderStatusFromNumber} from "./OrderStatusEnum";

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

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await orderService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

router.put("/:id/status/:status",
    handleAsync(
        async  (req: Request, res: Response) => {
            await orderService.update(
                Number(req.params.id),
                orderStatusFromNumber(Number(req.params.status))
            );
            res.status(201).send();
        }
    )
);

export default router;
