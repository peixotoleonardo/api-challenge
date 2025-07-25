import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'param id must be a valid MongoDB ObjectId' });
  }

  next();
};
