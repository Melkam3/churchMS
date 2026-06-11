import memberService from '../services/member.service.js';
import familyService from '../services/family.service.js';
import ministryService from '../services/ministry.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [memberStats, totalFamilies, totalMinistries] = await Promise.all([
    memberService.getStats(),
    familyService.count(),
    ministryService.count(),
  ]);
  successResponse(res, {
    totalMembers: memberStats.totalMembers,
    totalFamilies,
    totalMinistries,
    recentMembers: memberStats.recentMembers,
  }, 'Dashboard stats fetched');
});
