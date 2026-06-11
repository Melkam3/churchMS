import ministryService from '../services/ministry.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

export const getMinistries = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const result = await ministryService.getAll({ page: +page, limit: +limit, search });
  const { data, total, totalPages } = result;
  successResponse(res, data, 'Ministries fetched', 200, { total, page: +page, limit: +limit, totalPages });
});

export const getMinistry = asyncHandler(async (req, res) => {
  const ministry = await ministryService.getById(req.params.id);
  successResponse(res, ministry, 'Ministry fetched');
});

export const createMinistry = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const ministry = await ministryService.create(req.body);
  successResponse(res, ministry, 'Ministry created', 201);
});

export const updateMinistry = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const ministry = await ministryService.update(req.params.id, req.body);
  successResponse(res, ministry, 'Ministry updated');
});

export const deleteMinistry = asyncHandler(async (req, res) => {
  await ministryService.delete(req.params.id);
  successResponse(res, null, 'Ministry deleted');
});

export const assignMember = asyncHandler(async (req, res) => {
  const ministry = await ministryService.assignMember(req.params.id, req.body.memberId);
  successResponse(res, ministry, 'Member assigned to ministry');
});

export const removeMember = asyncHandler(async (req, res) => {
  const ministry = await ministryService.removeMember(req.params.id, req.params.memberId);
  successResponse(res, ministry, 'Member removed from ministry');
});
