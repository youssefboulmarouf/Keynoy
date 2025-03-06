import express, {Request, Response} from "express";
import { DeliveryCompanyService } from "./DeliveryCompanyService";
import {CustomerJson} from "../customer/CustomerJson";
import {DeliveryCompanyJson} from "./DeliveryCompanyJson";

const router = express.Router();
const deliveryCompanyService = new DeliveryCompanyService();

router.get("/", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await deliveryCompanyService.get()
        );
});

router.get("/:id", async (req: Request, res: Response) => {
    res
        .status(200)
        .json(
            await deliveryCompanyService.getById(
                Number(req.params.id)
            )
        );
});


router.post("/", async  (req: Request, res: Response) => {
    res
        .status(201)
        .json(
            await deliveryCompanyService.add(
                DeliveryCompanyJson.from(req.body)
            )
        );
});

router.put("/:id", async (req: Request, res: Response) => {    res
    .status(200)
    .json(
        await deliveryCompanyService.update(
            Number(req.params.id),
            CustomerJson.from(req.body)
        )
    );
});

router.delete("/:id", async (req: Request, res: Response) => {
    await deliveryCompanyService.delete(Number(req.params.id));
    res.status(204).send();
});



export default router;
