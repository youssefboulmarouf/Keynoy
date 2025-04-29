import express, {Request, Response} from "express";
import handleAsync from "../../utilities/HandleAsync";
import {CompanyDesignService} from "./CompanyDesignService";
import {CompanyDesignJson} from "./CompanyDesignJson";

const router = express.Router();
const companyDesignService = new CompanyDesignService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await companyDesignService.get()
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
                    await companyDesignService.getById(
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
                    await companyDesignService.add(
                        CompanyDesignJson.fromRequest(req.body)
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
                    await companyDesignService.update(
                        Number(req.params.id),
                        CompanyDesignJson.fromRequest(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await companyDesignService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
