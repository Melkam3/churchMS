import { body } from 'express-validator';

export const attendanceValidator = [
  body('member').notEmpty().withMessage('Member is required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('status').isIn(['Present', 'Absent']).withMessage('Status must be Present or Absent'),
];
