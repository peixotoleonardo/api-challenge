import { Logger } from 'pino';
import { ValidationError } from 'yup';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { DomainError } from '@api/modules/common/error/domain.error';

export const errorHandler =
  (logger: Logger) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  (err: any, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof ValidationError) {
      response.status(StatusCodes.BAD_REQUEST).json({ messages: err.errors });

      return;
    }

    if (err instanceof DomainError) {
      response
        .status(StatusCodes.UNPROCESSABLE_ENTITY)
        .json({ messages: err.message });

      return;
    }

    logger.error(
      { error: err, path: request.path, method: request.method },
      'there was an error',
    );

    const message = err.message || 'internal error';

    const status =
      err?.code || err?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

    response.status(status).json({ message });
  };
