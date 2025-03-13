import express, {Request, Response} from "express";
import { ProductTypeService } from "./ProductTypeService";
import {ProductTypeJson} from "./ProductTypeJson";
import handleAsync from "../../utilities/HandleAsync";

const router = express.Router();
const productTypeService = new ProductTypeService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await productTypeService.get()
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
                    await productTypeService.getById(
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
                    await productTypeService.add(
                        ProductTypeJson.from(req.body)
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
                await productTypeService.update(
                    Number(req.params.id),
                    ProductTypeJson.from(req.body)
                )
            );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await productTypeService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
