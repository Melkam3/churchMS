import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  HeartHandshake, 
  CalendarCheck, 
  LogOut 
} from 'lucide-react';
import { logoutUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        toast.success('Logged out successfully');
        navigate('/login');
      })
      .catch((err) => {
        toast.error(err || 'Logout failed');
      });
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Families', path: '/families', icon: Home },
    { name: 'Ministries', path: '/ministries', icon: HeartHandshake },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  ];

  return (
    <aside className="w-64 bg-navy-950 text-white flex flex-col min-h-screen shadow-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Grace Community</span>
        </h1>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Church Management</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              end={item.path === '/'}
            >
              <IconComponent size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer Panel */}
      <div className="p-4 border-t border-white/10 bg-navy-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-navy-800 border border-white/10 flex items-center justify-center font-bold text-navy-200">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 capitalize font-medium">{user?.role || 'staff'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300 active:bg-red-500/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
