import attendanceService from '../services/attendance.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

export const getAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, memberId, date, status } = req.query;
  const result = await attendanceService.getAll({ page: +page, limit: +limit, memberId, date, status });
  const { data, total, totalPages } = result;
  successResponse(res, data, 'Attendance fetched', 200, { total, page: +page, limit: +limit, totalPages });
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getById(req.params.id);
  successResponse(res, attendance, 'Attendance fetched');
});

export const recordAttendance = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const attendance = await attendanceService.record({ ...req.body, recordedBy: req.user._id });
  successResponse(res, attendance, 'Attendance recorded', 201);
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.update(req.params.id, req.body);
  successResponse(res, attendance, 'Attendance updated');
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.delete(req.params.id);
  successResponse(res, null, 'Attendance deleted');
});
