import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  successResponse(res, { user, accessToken, refreshToken }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
  successResponse(res, { user, accessToken, refreshToken }, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  successResponse(res, null, 'Logout successful');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  successResponse(res, user, 'User fetched');
});
