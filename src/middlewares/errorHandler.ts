import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { z } from "zod";

export const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      error: "Invalid data",
      details: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
  } else {
    console.error(err)
    res.status(500).json({ error: "An unexpected error occurred" })
  }
};