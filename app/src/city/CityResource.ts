import express, {Request, Response} from "express";
import handleAsync from "../utilities/HandleAsync";
import {CityService} from "./CityService";
import {CityJson} from "./CityJson";

const router = express.Router();
const cityService = new CityService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await cityService.get()
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
                    await cityService.getById(
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
                    await cityService.add(
                        CityJson.from(req.body)
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
                await cityService.update(
                    Number(req.params.id),
                    CityJson.from(req.body)
                )
            );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await cityService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
