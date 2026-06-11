import { body } from 'express-validator';

export const ministryValidator = [
  body('name').trim().notEmpty().withMessage('Ministry name is required'),
];
