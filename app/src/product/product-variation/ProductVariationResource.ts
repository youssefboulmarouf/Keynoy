import express, {Request, Response} from "express";
import handleAsync from "../../utilities/HandleAsync";
import {ProductVariationService} from "./ProductVariationService";
import {ProductVariationJson} from "./ProductVariationJson";

const router = express.Router();
const productVariationService = new ProductVariationService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await productVariationService.get()
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
                    await productVariationService.getById(
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
                    await productVariationService.add(
                        ProductVariationJson.fromObject(req.body)
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
                await productVariationService.update(
                    Number(req.params.id),
                    ProductVariationJson.fromObject(req.body)
                )
            );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await productVariationService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
