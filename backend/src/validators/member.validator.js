import { body } from 'express-validator';

export const memberValidator = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('gender').isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('email').optional({ nullable: true, checkFalsy: true }).isEmail().withMessage('Valid email required'),
  body('baptismStatus').optional().isIn(['Baptized', 'Not Baptized', 'Pending']),
  body('membershipStatus').optional().isIn(['Active', 'Inactive', 'Transferred', 'Deceased']),
];
