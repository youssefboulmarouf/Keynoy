import express, {Request, Response} from "express";
import {OrderService} from "./OrderService";
import {OrderJson} from "./OrderJson";
import {DeliveryJson} from "./DeliveryJson";
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
                        OrderJson.fromRequest(req.body)
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
                    await orderService.update(
                        Number(req.params.id),
                        OrderJson.fromRequest(req.body)
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

router.post("/:id/shipped",
    handleAsync(
        async  (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await orderService.shipped(
                        DeliveryJson.from(req.body)
                    )
                );
        }
    )
);

export default router;
