import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { BaseService } from '../services/BaseService';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return BaseService.validationError(res, errors);
  }
  
  next();
};
