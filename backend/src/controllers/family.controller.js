import familyService from '../services/family.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';
import { validationResult } from 'express-validator';

export const getFamilies = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const result = await familyService.getAll({ page: +page, limit: +limit, search });
  const { data, total, totalPages } = result;
  successResponse(res, data, 'Families fetched', 200, { total, page: +page, limit: +limit, totalPages });
});

export const getFamily = asyncHandler(async (req, res) => {
  const family = await familyService.getById(req.params.id);
  successResponse(res, family, 'Family fetched');
});

export const createFamily = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const family = await familyService.create(req.body);
  successResponse(res, family, 'Family created', 201);
});

export const updateFamily = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  const family = await familyService.update(req.params.id, req.body);
  successResponse(res, family, 'Family updated');
});

export const deleteFamily = asyncHandler(async (req, res) => {
  await familyService.delete(req.params.id);
  successResponse(res, null, 'Family deleted');
});

export const addMemberToFamily = asyncHandler(async (req, res) => {
  const family = await familyService.addMember(req.params.id, req.body.memberId);
  successResponse(res, family, 'Member added to family');
});
