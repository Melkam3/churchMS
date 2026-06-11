import { body } from 'express-validator';

export const familyValidator = [
  body('familyName').trim().notEmpty().withMessage('Family name is required'),
];
