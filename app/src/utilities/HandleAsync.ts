import { Request, Response, NextFunction } from "express";
import AppError from "./AppError";

const handleAsync =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                await fn(req, res, next);
            } catch (e) {
                if (e instanceof AppError) {
                    res.status(e.status).json({
                        name: e.name,
                        message: e.message,
                    });
                } else {
                    console.error("Unexpected error:", e);
                    res.status(500).json({
                        name: "UnknownError",
                        message: "An unexpected error occurred.",
                    });
                }
            }
        };

export default handleAsync;