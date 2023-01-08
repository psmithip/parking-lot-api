import { NextFunction, Request, Response } from 'express';
import { statusCodeEnum } from '../enums/statusCodeEnum';
import { CustomError } from '../utils/customError';

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = error?.statusCode || statusCodeEnum.INTERNAL_SERVER_ERROR;
  res.status(status).json({ message: error.message });
};
