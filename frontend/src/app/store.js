import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import memberReducer from '../features/members/memberSlice';
import familyReducer from '../features/families/familySlice';
import ministryReducer from '../features/ministries/ministrySlice';
import attendanceReducer from '../features/attendance/attendanceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: memberReducer,
    families: familyReducer,
    ministries: ministryReducer,
    attendance: attendanceReducer,
  },
});

export default store;
