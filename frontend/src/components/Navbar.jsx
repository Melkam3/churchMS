import React from 'react';
import { useSelector } from 'react-redux';
import { User, Bell, Calendar } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useSelector((state) => state.auth);
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title || 'Dashboard'}</h2>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-6">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 font-medium">
          <Calendar size={16} />
          <span>{today}</span>
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-gray-200 hidden md:block"></div>

        {/* User Card */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize font-medium">{user?.role || 'Staff'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-navy-50 flex items-center justify-center text-navy-800 font-bold border border-navy-100">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
