import { Request, Response, NextFunction } from "express";

class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 500;
    }
}
export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, 404);   
  }
}

export class ChirpTooLongError extends BadRequestError {
  constructor(message: string) {
    super(message);
    this.name = "ChirpTooLongError";
  }
}

export function handleErrors(err: CustomError, req: Request, res: Response, next: NextFunction) {
  console.log(`ERROR: ${err.statusCode || 500} -  ${err.message}`);

  res.status(err.statusCode || 500).send({ error: err.message || "Internal Server Error" });
  
};
