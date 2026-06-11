import express from 'express';
import { getAttendance, getAttendanceById, recordAttendance, updateAttendance, deleteAttendance } from '../controllers/attendance.controller.js';
import { attendanceValidator } from '../validators/attendance.validator.js';
import { validate } from '../validators/auth.validator.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getAttendance);
router.get('/:id', getAttendanceById);
router.post('/', attendanceValidator, validate, recordAttendance);
router.put('/:id', updateAttendance);
router.delete('/:id', deleteAttendance);

export default router;
