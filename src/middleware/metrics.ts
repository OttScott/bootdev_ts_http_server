import { Request, Response, NextFunction } from "express";
import { api_config } from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  api_config.fileserverHits += 1;
  
  next();
}