import express, {Request, Response} from "express";
import handleAsync from "../utilities/HandleAsync";
import {CompanyService} from "./CompanyService";
import {CompanyJson} from "./CompanyJson";

const router = express.Router();
const companyService = new CompanyService();

router.get("/",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await companyService.get()
                );
        }
    )
);

router.get("/customers",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await companyService.getCustomers()
                );
        }
    )
);

router.get("/suppliers",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await companyService.getSuppliers()
                );
        }
    )
);

router.get("/shippers",
    handleAsync(
        async (req: Request, res: Response) => {
            res
                .status(200)
                .json(
                    await companyService.getShippers()
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
                    await companyService.getById(
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
                    await companyService.add(
                        CompanyJson.from(req.body)
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
                    await companyService.update(
                        Number(req.params.id),
                        CompanyJson.from(req.body)
                    )
                );
        }
    )
);

router.delete("/:id",
    handleAsync(
        async (req: Request, res: Response) => {
            await companyService.delete(Number(req.params.id));
            res.status(204).send();
        }
    )
);

export default router;
