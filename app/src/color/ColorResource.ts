import express, {Request, Response} from "express";
import handleAsync from "../utilities/HandleAsync";
import {ColorService} from "./ColorService";
import {ColorJson} from "./ColorJson";

const router = express.Router();
const colorService = new ColorService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await colorService.get()
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
                    await colorService.getById(
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
                    await colorService.add(
                        ColorJson.from(req.body)
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
                await colorService.update(
                    Number(req.params.id),
                    ColorJson.from(req.body)
                )
            );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await colorService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
