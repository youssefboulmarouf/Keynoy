import express, {Request, Response} from "express";
import { CustomerService } from "./CustomerService";
import {CustomerJson} from "./CustomerJson";

const router = express.Router();
const customerService = new CustomerService();

router.get("/", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await customerService.get()
        );
});

router.get("/:id", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await customerService.getById(
                Number(req.params.id)
            )
        );
});

router.post("/", async  (req: Request, res: Response) => {
    res
        .status(201)
        .json(
            await customerService.add(
                CustomerJson.from(req.body)
            )
        );
});

router.put("/:id", async (req: Request, res: Response) => {    res
        .status(200)
        .json(
            await customerService.update(
                Number(req.params.id),
                CustomerJson.from(req.body)
            )
        );
});

router.delete("/:id", async (req: Request, res: Response) => {
    await customerService.delete(Number(req.params.id));
    res.status(204).send();
});

export default router;
