import memberService from '../services/member.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

export const getMembers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', membershipStatus, gender } = req.query;
  const filter = {};
  if (membershipStatus) filter.membershipStatus = membershipStatus;
  if (gender) filter.gender = gender;
  const result = await memberService.getAll({ page: +page, limit: +limit, search, filter });
  const { data, total, totalPages } = result;
  successResponse(res, data, 'Members fetched', 200, { total, page: +page, limit: +limit, totalPages });
});

export const getMember = asyncHandler(async (req, res) => {
  const member = await memberService.getById(req.params.id);
  successResponse(res, member, 'Member fetched');
});

export const createMember = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const member = await memberService.create(req.body);
  successResponse(res, member, 'Member created', 201);
});

export const updateMember = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const member = await memberService.update(req.params.id, req.body);
  successResponse(res, member, 'Member updated');
});

export const deleteMember = asyncHandler(async (req, res) => {
  await memberService.delete(req.params.id);
  successResponse(res, null, 'Member deleted');
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const photoPath = `/uploads/${req.file.filename}`;
  const member = await memberService.updatePhoto(req.params.id, photoPath);
  successResponse(res, member, 'Photo uploaded');
});
