import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchAttendance, deleteAttendance } from '../features/attendance/attendanceSlice';
import Spinner from '../components/Spinner';
import { 
  ClipboardCheck, 
  Calendar, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Search,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const AttendanceHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: records, loading, error, pagination } = useSelector((state) => state.attendance);
  const { user } = useSelector((state) => state.auth);

  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (dateFilter) params.date = dateFilter;
    dispatch(fetchAttendance(params));
  }, [dispatch, page, dateFilter]);

  // Reset page when date changes
  useEffect(() => {
    setPage(1);
  }, [dateFilter]);

  const handleDelete = (id, memberName, dateStr) => {
    const formattedDate = new Date(dateStr).toLocaleDateString();
    if (window.confirm(`Are you sure you want to delete the attendance record for ${memberName} on ${formattedDate}?`)) {
      dispatch(deleteAttendance(id))
        .unwrap()
        .then(() => {
          toast.success('Attendance record deleted');
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete record');
        });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Log History</h1>
          <p className="text-sm text-gray-400">Review past service attendance logs</p>
        </div>
        <button
          onClick={() => navigate('/attendance')}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Record Attendance</span>
        </button>
      </div>

      {/* Date filter card */}
      <div className="card max-w-sm flex items-center gap-3">
        <Calendar size={18} className="text-gray-400" />
        <div className="flex-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Filter by Date</label>
          <input
            type="date"
            className="input-field py-1 text-xs border-none focus:ring-0 p-0"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        {dateFilter && (
          <button 
            onClick={() => setDateFilter('')}
            className="text-xs text-gray-400 hover:text-navy-800 font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* History Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="table-header">Date</th>
                  <th className="table-header">Member Name</th>
                  <th className="table-header">Attendance Status</th>
                  <th className="table-header">Notes / Remarks</th>
                  <th className="table-header hidden sm:table-cell">Recorded By</th>
                  {user?.role === 'admin' && <th className="table-header text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {records.map((record) => {
                  const memberName = record.member 
                    ? `${record.member.firstName} ${record.member.lastName}` 
                    : 'Unknown Member';
                  return (
                    <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="table-cell font-semibold">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="table-cell">
                        {record.member ? (
                          <span 
                            onClick={() => navigate(`/members/${record.member._id}`)}
                            className="text-navy-800 hover:underline cursor-pointer font-medium"
                          >
                            {memberName}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Deleted Member</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {record.status === 'Present' ? (
                          <span className="badge-present gap-1">
                            <CheckCircle size={12} />
                            Present
                          </span>
                        ) : (
                          <span className="badge-absent gap-1">
                            <XCircle size={12} />
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="table-cell italic text-gray-500">
                        {record.notes || '—'}
                      </td>
                      <td className="table-cell hidden sm:table-cell text-xs text-gray-400">
                        {record.recordedBy?.name || 'System Operator'}
                      </td>
                      {user?.role === 'admin' && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                          <button
                            onClick={() => handleDelete(record._id, memberName, record.date)}
                            className="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-12 text-sm text-gray-400 italic">
                      No attendance logs found matching filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
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

export default AttendanceHistory;
