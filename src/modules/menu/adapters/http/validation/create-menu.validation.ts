import * as yup from 'yup';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

export const createMenuValidation = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const schema = yup.object().shape({
    name: yup.string().required().min(3),
    relatedId: yup.string().test({
      name: 'isValidObjectId',
      message: 'should be ObjectId',
      test: (value) => !value || mongoose.Types.ObjectId.isValid(value),
    }),
  });

  await schema.validate(req.body, { abortEarly: false });

  next();
};
