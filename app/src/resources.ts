import express from "express";
import { Request, Response } from "express";


const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Keynoy backend is running!");
});

export default router;