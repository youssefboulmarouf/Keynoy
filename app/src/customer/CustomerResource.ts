import express, {Request, Response} from "express";
import { CustomerService } from "./CustomerService";
import {CustomerJson} from "./CustomerJson";
import handleAsync from "../utilities/HandleAsync";

const router = express.Router();
const customerService = new CustomerService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await customerService.get()
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
                    await customerService.getById(
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
                    await customerService.add(
                        CustomerJson.from(req.body)
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
                    await customerService.update(
                        Number(req.params.id),
                        CustomerJson.from(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await customerService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
