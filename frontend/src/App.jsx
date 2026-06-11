import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Components & guards
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Page views
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MemberList from './pages/MemberList';
import MemberDetail from './pages/MemberDetail';
import MemberForm from './pages/MemberForm';
import FamilyList from './pages/FamilyList';
import FamilyDetail from './pages/FamilyDetail';
import FamilyForm from './pages/FamilyForm';
import MinistryList from './pages/MinistryList';
import MinistryDetail from './pages/MinistryDetail';
import MinistryForm from './pages/MinistryForm';
import AttendanceRecord from './pages/AttendanceRecord';
import AttendanceHistory from './pages/AttendanceHistory';

// Layout wrapper to inject sidebar, navbar, and dynamic title
const DashboardLayout = () => {
  const location = useLocation();

  const getPageTitle = (path) => {
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/members')) {
      if (path.endsWith('/new')) return 'Register New Member';
      if (path.endsWith('/edit')) return 'Edit Member Profile';
      return 'Members Directory';
    }
    if (path.startsWith('/families')) {
      if (path.endsWith('/new')) return 'Create Family Unit';
      if (path.endsWith('/edit')) return 'Modify Family Unit';
      return 'Family Units';
    }
    if (path.startsWith('/ministries')) {
      if (path.endsWith('/new')) return 'Start New Ministry';
      if (path.endsWith('/edit')) return 'Modify Ministry';
      return 'Church Ministries';
    }
    if (path.startsWith('/attendance')) {
      if (path.endsWith('/history')) return 'Attendance History Log';
      return 'Record Sunday Attendance';
    }
    return 'Church Portal';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <Navbar title={getPageTitle(location.pathname)} />

        {/* Dynamic page contents */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication paths */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private portal paths */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Members routing */}
            <Route path="members" element={<MemberList />} />
            <Route path="members/:id" element={<MemberDetail />} />
            <Route path="members/new" element={<MemberForm />} />
            <Route path="members/:id/edit" element={<MemberForm />} />

            {/* Families routing */}
            <Route path="families" element={<FamilyList />} />
            <Route path="families/:id" element={<FamilyDetail />} />
            <Route path="families/new" element={<FamilyForm />} />
            <Route path="families/:id/edit" element={<FamilyForm />} />

            {/* Ministries routing */}
            <Route path="ministries" element={<MinistryList />} />
            <Route path="ministries/:id" element={<MinistryDetail />} />
            <Route path="ministries/new" element={<MinistryForm />} />
            <Route path="ministries/:id/edit" element={<MinistryForm />} />

            {/* Attendance routing */}
            <Route path="attendance" element={<AttendanceRecord />} />
            <Route path="attendance/history" element={<AttendanceHistory />} />
          </Route>
        </Route>
      </Routes>

      {/* Toast Alert Notifications */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
};

export default App;
