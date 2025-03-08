import express, {Request, Response} from "express";
import {OrderService} from "./OrderService";
import {OrderJson} from "./OrderJson";

const router = express.Router();
const orderService = new OrderService();

router.get("/", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await orderService.get()
        );
});

router.get("/:id", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await orderService.getById(
                Number(req.params.id)
            )
        );
});

router.post("/", async  (req: Request, res: Response) => {
    res
        .status(201)
        .json(
            await orderService.add(
                OrderJson.fromRequest(req.body)
            )
        );
});

router.put("/:id", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await orderService.update(
                Number(req.params.id),
                OrderJson.fromRequest(req.body)
            )
        );
});

router.delete("/:id", async (req: Request, res: Response) => {
    await orderService.delete(Number(req.params.id));
    res.status(204).send();
});

export default router;
