import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMembers, deleteMember } from '../features/members/memberSlice';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from '../components/Spinner';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  User 
} from 'lucide-react';
import { toast } from 'react-toastify';

const MemberList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, pagination } = useSelector((state) => state.members);
  const { user } = useSelector((state) => state.auth); // for role check

  // Search & Filters State
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [membershipStatus, setMembershipStatus] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    dispatch(fetchMembers({ 
      page, 
      limit: 8, 
      search: debouncedSearch, 
      gender, 
      membershipStatus 
    }));
  }, [dispatch, page, debouncedSearch, gender, membershipStatus]);

  // Reset page to 1 when search or filter changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, gender, membershipStatus]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteMember(id))
        .unwrap()
        .then(() => {
          toast.success(`${name} deleted successfully`);
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete member');
        });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Congregation Members</h1>
          <p className="text-sm text-gray-400">View and manage member directory profiles</p>
        </div>
        <button
          onClick={() => navigate('/members/new')}
          className="btn-primary"
        >
          <UserPlus size={18} />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search and Filters Card */}
      <div className="card grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Gender Filter */}
        <div>
          <select
            className="input-field"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Membership Status Filter */}
        <div>
          <select
            className="input-field"
            value={membershipStatus}
            onChange={(e) => setMembershipStatus(e.target.value)}
          >
            <option value="">All Membership Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Transferred">Transferred</option>
            <option value="Deceased">Deceased</option>
          </select>
        </div>
      </div>

      {/* Main Members Directory Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="table-header">Name</th>
                  <th className="table-header">Gender</th>
                  <th className="table-header hidden md:table-cell">Family Name</th>
                  <th className="table-header font-medium hidden sm:table-cell">Contact</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {items.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {member.profilePhoto ? (
                          <img
                            src={`http://localhost:5000${member.profilePhoto}`}
                            alt={member.firstName}
                            className="w-9 h-9 rounded-full object-cover border border-gray-100"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-navy-50 text-navy-800 font-bold border border-navy-100 flex items-center justify-center text-xs">
                            {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div 
                            className="text-sm font-semibold text-gray-800 hover:text-navy-800 cursor-pointer"
                            onClick={() => navigate(`/members/${member._id}`)}
                          >
                            {member.firstName} {member.lastName}
                          </div>
                          <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase bg-gray-100 px-1.5 py-0.5 rounded">
                            {member.baptismStatus}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{member.gender}</td>
                    <td className="table-cell hidden md:table-cell">
                      {member.family ? (
                        <span 
                          onClick={() => navigate(`/families/${member.family._id}`)}
                          className="text-navy-800 hover:underline cursor-pointer font-medium"
                        >
                          {member.family.familyName}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs italic">Unassigned</span>
                      )}
                    </td>
                    <td className="table-cell hidden sm:table-cell">
                      <div className="text-xs text-gray-700 font-semibold">{member.phone || 'No phone'}</div>
                      <div className="text-[11px] text-gray-400">{member.email || 'No email'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={member.membershipStatus === 'Active' ? 'badge-active' : 'badge-inactive'}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/members/${member._id}`)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 transition-colors"
                          title="View Profile"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => navigate(`/members/${member._id}/edit`)}
                          className="p-1.5 rounded-md hover:bg-navy-50 hover:text-navy-800 text-gray-600 transition-colors"
                          title="Edit Profile"
                        >
                          <Edit2 size={16} />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => handleDelete(member._id, `${member.firstName} ${member.lastName}`)}
                            className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                            title="Delete Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-sm text-gray-400 font-medium">
                      No congregation members match your filters or search terms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Panel */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Showing page {page} of {pagination.totalPages} (Total: {pagination.total})
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="btn-secondary py-1.5 px-3 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(p + 1, pagination.totalPages))}
                className="btn-secondary py-1.5 px-3 disabled:opacity-40 disabled:hover:bg-white"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;
