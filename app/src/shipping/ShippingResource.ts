import express, {Request, Response} from "express";
import handleAsync from "../utilities/HandleAsync";
import {ShippingService} from "./ShippingService";
import {ShippingJson} from "./ShippingJson";

const router = express.Router();
const shippingService = new ShippingService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await shippingService.get()
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
                    await shippingService.getByOrderId(
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
                    await  shippingService.add(
                        ShippingJson.from(req.body)
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
                    await shippingService.update(
                        Number(req.params.id),
                        ShippingJson.from(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await shippingService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
