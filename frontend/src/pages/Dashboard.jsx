import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import Spinner from '../components/Spinner';
import { 
  Users, 
  Home, 
  HeartHandshake, 
  Calendar, 
  UserPlus, 
  PlusCircle, 
  ClipboardList, 
  TrendingUp, 
  ChevronRight 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, attendanceRes] = await Promise.all([
          axiosInstance.get('/dashboard/stats'),
          axiosInstance.get('/attendance', { params: { limit: 100 } })
        ]);
        setStats(statsRes.data.data);

        // Group attendance by date to calculate percentage
        const attRecords = attendanceRes.data.data || [];
        const grouped = attRecords.reduce((acc, curr) => {
          const dateStr = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!acc[dateStr]) acc[dateStr] = { date: dateStr, present: 0, total: 0 };
          acc[dateStr].total += 1;
          if (curr.status === 'Present') acc[dateStr].present += 1;
          return acc;
        }, {});
        
        const sorted = Object.values(grouped).slice(-6); // Last 6 dates
        setAttendanceStats(sorted.length > 0 ? sorted : [
          { date: 'Sun 1', present: 4, total: 5 },
          { date: 'Sun 2', present: 3, total: 5 },
          { date: 'Sun 3', present: 5, total: 5 },
          { date: 'Sun 4', present: 4, total: 5 },
        ]);
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <Spinner size="lg" fullPage />;

  const { totalMembers, totalFamilies, totalMinistries, recentMembers } = stats || {
    totalMembers: 0,
    totalFamilies: 0,
    totalMinistries: 0,
    recentMembers: []
  };

  // Quick metric values
  const metrics = [
    { title: 'Total Members', value: totalMembers, icon: Users, color: 'text-blue-600 bg-blue-50 border-blue-100', link: '/members' },
    { title: 'Families', value: totalFamilies, icon: Home, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', link: '/families' },
    { title: 'Ministries', value: totalMinistries, icon: HeartHandshake, color: 'text-purple-600 bg-purple-50 border-purple-100', link: '/ministries' },
  ];

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = 30;

  // Calculate coordinates for the SVG path representing attendance percentage
  const chartPoints = attendanceStats.map((item, index) => {
    const rate = item.total > 0 ? (item.present / item.total) * 100 : 0;
    const x = padding + (index * (chartWidth - padding * 2)) / (attendanceStats.length - 1 || 1);
    const y = chartHeight - padding - (rate * (chartHeight - padding * 2)) / 100;
    return { x, y, rate, date: item.date };
  });

  const pathD = chartPoints.reduce((acc, point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = chartPoints.length > 0 
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - padding} L ${chartPoints[0].x} ${chartHeight - padding} Z`
    : '';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-2xl p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Grace Community Church</h1>
          <p className="text-gray-300 mt-2 max-w-xl">
            Welcome to the Church Management System. Streamline your administration, record attendance, manage family records, and view ministry details.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => navigate('/members/new')}
            className="btn-accent shadow-md hover:scale-102 transition-all font-medium py-2.5"
          >
            <UserPlus size={18} />
            <span>Add Member</span>
          </button>
          <button 
            onClick={() => navigate('/attendance')}
            className="btn-primary bg-white hover:bg-gray-100 text-navy-800 border-none shadow-md hover:scale-102 transition-all font-medium py-2.5"
          >
            <ClipboardList size={18} />
            <span>Record Attendance</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div 
              key={metric.title}
              onClick={() => navigate(metric.link)}
              className="card hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 duration-350 flex items-center justify-between group"
            >
              <div className="space-y-1">
                <span className="text-sm font-semibold text-gray-500">{metric.title}</span>
                <p className="text-3xl font-black text-gray-800 group-hover:text-navy-800 transition-colors">{metric.value}</p>
              </div>
              <div className={`p-4 rounded-xl border ${metric.color} transition-transform duration-350 group-hover:scale-110`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom SVG Line Chart for Attendance */}
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-navy-800" size={20} />
              <h3 className="text-lg font-bold text-gray-800">Weekly Attendance Trends</h3>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 py-1 px-2.5 rounded-full">Last 6 Weeks</span>
          </div>

          <div className="relative pt-4 w-full">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              {/* Grid Lines */}
              {[0, 25, 50, 75, 100].map((val) => {
                const y = chartHeight - padding - (val * (chartHeight - padding * 2)) / 100;
                return (
                  <g key={val} className="opacity-10">
                    <line x1={padding} y1={y} x2={chartWidth - padding} y2={y} stroke="black" strokeWidth={1} strokeDasharray="3,3" />
                    <text x={padding - 5} y={y + 4} textAnchor="end" fontSize={10} fontWeight="bold">{val}%</text>
                  </g>
                );
              })}

              {/* Area path */}
              {areaD && <path d={areaD} fill="url(#chartGradient)" className="opacity-20" />}
              {/* Line path */}
              {pathD && <path d={pathD} fill="none" stroke="#1e3a5f" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a5f" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>

              {/* Highlight Points & Labels */}
              {chartPoints.map((point, i) => (
                <g key={i}>
                  <circle cx={point.x} cy={point.y} r={4} fill="#1e3a5f" stroke="#ffffff" strokeWidth={1.5} className="hover:r-6 cursor-pointer" />
                  <text x={point.x} y={point.y - 8} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#1e2e4a">
                    {point.rate.toFixed(0)}%
                  </text>
                  <text x={point.x} y={chartHeight - 10} textAnchor="middle" fontSize={10} fill="#6b7280" fontWeight="medium">
                    {point.date}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="card flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">Administrative Actions</h3>
            <p className="text-xs text-gray-400">Quickly create and manage database records</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <button 
              onClick={() => navigate('/members/new')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-navy-100 hover:bg-navy-50/20 text-left text-sm font-semibold text-gray-700 transition-all group"
            >
              <span className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                  <UserPlus size={16} />
                </span>
                Add a New Member
              </span>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/families/new')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-navy-100 hover:bg-navy-50/20 text-left text-sm font-semibold text-gray-700 transition-all group"
            >
              <span className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <PlusCircle size={16} />
                </span>
                Create a Family Unit
              </span>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button 
              onClick={() => navigate('/ministries/new')}
              className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-navy-100 hover:bg-navy-50/20 text-left text-sm font-semibold text-gray-700 transition-all group"
            >
              <span className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                  <HeartHandshake size={16} />
                </span>
                Start a New Ministry
              </span>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Members Panel */}
      <div className="card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Recently Registered Members</h3>
            <p className="text-xs text-gray-400">Newly added congregation profiles</p>
          </div>
          <button 
            onClick={() => navigate('/members')}
            className="text-xs font-semibold text-navy-800 hover:text-navy-900 underline flex items-center gap-1"
          >
            View All Members
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="table-header">Name</th>
                <th className="table-header">Gender</th>
                <th className="table-header font-medium hidden sm:table-cell">Contact Details</th>
                <th className="table-header">Baptism Status</th>
                <th className="table-header">Membership Status</th>
                <th className="table-header text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recentMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy-50 text-navy-800 font-bold border border-navy-100 flex items-center justify-center text-xs">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 hover:text-navy-800 cursor-pointer" onClick={() => navigate(`/members/${member._id}`)}>
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">Joined {new Date(member.joinDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{member.gender}</td>
                  <td className="table-cell hidden sm:table-cell">
                    <div className="text-xs text-gray-700">{member.phone || 'No Phone'}</div>
                    <div className="text-[11px] text-gray-400">{member.email || 'No Email'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={member.baptismStatus === 'Baptized' ? 'badge-baptized' : 'badge-inactive'}>
                      {member.baptismStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={member.membershipStatus === 'Active' ? 'badge-active' : 'badge-inactive'}>
                      {member.membershipStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                    <button 
                      onClick={() => navigate(`/members/${member._id}`)}
                      className="text-navy-800 hover:text-navy-950 font-bold hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
              {recentMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-sm text-gray-400 font-medium">
                    No recent members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
