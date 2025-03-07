import express, {Request, Response} from "express";
import { SupplierService } from "./SupplierService";
import {SupplierJson} from "./SupplierJson";

const router = express.Router();
const supplierService = new SupplierService();

router.get("/", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await supplierService.get()
        );
});

router.get("/:id", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await supplierService.getById(
                Number(req.params.id)
            )
        );
});

router.post("/", async  (req: Request, res: Response) => {
    res
        .status(201)
        .json(
            await supplierService.add(
                SupplierJson.from(req.body)
            )
        );
});

router.put("/:id", async (req: Request, res: Response) => {    res
    .status(200)
    .json(
        await supplierService.update(
            Number(req.params.id),
            SupplierJson.from(req.body)
        )
    );
});

router.delete("/:id", async (req: Request, res: Response) => {
    await supplierService.delete(Number(req.params.id));
    res.status(204).send();
});



export default router;
