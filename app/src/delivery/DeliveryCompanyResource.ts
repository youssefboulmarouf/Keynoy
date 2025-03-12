import express, {Request, Response} from "express";
import { DeliveryCompanyService } from "./DeliveryCompanyService";
import {DeliveryCompanyJson} from "./DeliveryCompanyJson";
import handleAsync from "../utilities/HandleAsync";

const router = express.Router();
const deliveryCompanyService = new DeliveryCompanyService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await deliveryCompanyService.get()
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
                    await deliveryCompanyService.getById(
                        Number(req.params.id)
                    )
                );
        }
    )
);

router.post("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(201)
                .json(
                    await deliveryCompanyService.add(
                        DeliveryCompanyJson.from(req.body)
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
                    await deliveryCompanyService.update(
                        Number(req.params.id),
                        DeliveryCompanyJson.from(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await deliveryCompanyService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
