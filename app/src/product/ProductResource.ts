import express, {Request, Response} from "express";
import {ProductService} from "./ProductService";
import {ProductJson} from "./ProductJson";
import handleAsync from "../utilities/HandleAsync";

const router = express.Router();
const productService = new ProductService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await productService.get()
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
                    await productService.getById(
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
                    await productService.add(
                        ProductJson.fromObject(req.body)
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
                    await productService.update(
                        Number(req.params.id),
                        ProductJson.fromObject(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await productService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
