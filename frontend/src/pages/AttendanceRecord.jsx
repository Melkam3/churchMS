import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMembers } from '../features/members/memberSlice';
import { recordAttendance } from '../features/attendance/attendanceSlice';
import axiosInstance from '../services/axiosInstance';
import Spinner from '../components/Spinner';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Save, 
  ClipboardCheck, 
  History,
  Check,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';

const AttendanceRecord = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: members, loading: membersLoading } = useSelector((state) => state.members);
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState({}); // { memberId: { status, notes, recordId } }
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load Active Members
  useEffect(() => {
    dispatch(fetchMembers({ limit: 200, membershipStatus: 'Active' }));
  }, [dispatch]);

  // Load existing records for the selected date
  useEffect(() => {
    const fetchExistingRecords = async () => {
      try {
        setLoadingRecords(true);
        const res = await axiosInstance.get('/attendance', { params: { date, limit: 200 } });
        const existing = res.data.data || [];
        
        // Map existing records to local state
        const stateMap = {};
        existing.forEach(rec => {
          const mId = rec.member?._id || rec.member;
          stateMap[mId] = {
            status: rec.status,
            notes: rec.notes || '',
            recordId: rec._id
          };
        });

        // Initialize state for members that don't have records
        setAttendanceState(prevState => {
          const newState = { ...stateMap };
          members.forEach(m => {
            if (!newState[m._id]) {
              newState[m._id] = { status: 'Present', notes: '', recordId: null };
            }
          });
          return newState;
        });
      } catch (err) {
        toast.error('Failed to load existing attendance records');
      } finally {
        setLoadingRecords(false);
      }
    };

    if (members.length > 0) {
      fetchExistingRecords();
    }
  }, [date, members]);

  const handleStatusChange = (memberId, status) => {
    setAttendanceState(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], status }
    }));
  };

  const handleNotesChange = (memberId, notes) => {
    setAttendanceState(prev => ({
      ...prev,
      [memberId]: { ...prev[memberId], notes }
    }));
  };

  const handleMarkAll = (status) => {
    setAttendanceState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(mId => {
        updated[mId].status = status;
      });
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const promises = Object.entries(attendanceState).map(([mId, record]) => {
        const payload = {
          member: mId,
          date,
          status: record.status,
          notes: record.notes
        };
        return dispatch(recordAttendance(payload)).unwrap();
      });

      await Promise.all(promises);
      toast.success('Attendance records saved successfully');
      navigate('/attendance/history');
    } catch (err) {
      toast.error(err || 'Failed to save attendance records');
    } finally {
      setSaving(false);
    }
  };

  const activeCount = members.length;
  const presentCount = Object.values(attendanceState).filter(r => r.status === 'Present').length;
  const absentCount = activeCount - presentCount;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and history link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Record Sunday Attendance</h1>
          <p className="text-sm text-gray-400">Log attendance rosters and details</p>
        </div>
        <button
          onClick={() => navigate('/attendance/history')}
          className="btn-secondary"
        >
          <History size={16} />
          <span>Attendance Log History</span>
        </button>
      </div>

      {/* Date Picker & Counts Summary */}
      <div className="card flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        {/* Date Selection */}
        <div className="flex items-center gap-3">
          <Calendar className="text-navy-800" size={24} />
          <div>
            <label className="label mb-0">Roster Service Date</label>
            <input
              type="date"
              className="input-field max-w-xs mt-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Attendance counter stats */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl min-w-28 text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Active Members</span>
            <p className="text-xl font-bold text-gray-800">{activeCount}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl min-w-28 text-center">
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Present</span>
            <p className="text-xl font-bold text-emerald-800">{presentCount}</p>
          </div>
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl min-w-28 text-center">
            <span className="text-[10px] font-bold text-red-600 uppercase">Absent</span>
            <p className="text-xl font-bold text-red-800">{absentCount}</p>
          </div>
        </div>
      </div>

      {/* Actions & Roster List */}
      <form onSubmit={handleSubmit} className="card p-0 overflow-hidden space-y-4">
        {/* Quick select buttons */}
        <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between gap-4">
          <span className="text-sm font-bold text-gray-700">Congregation Roster</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleMarkAll('Present')}
              className="btn-secondary py-1 px-3 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll('Absent')}
              className="btn-secondary py-1 px-3 text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Member list to mark */}
        {membersLoading || loadingRecords ? (
          <div className="py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="divide-y divide-gray-100">
            {members.map((member) => {
              const state = attendanceState[member._id] || { status: 'Present', notes: '' };
              return (
                <div 
                  key={member._id} 
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/20 transition-colors"
                >
                  {/* Name and photo */}
                  <div className="flex items-center gap-3 min-w-64">
                    <div className="w-9 h-9 rounded-full bg-navy-50 text-navy-800 font-bold border border-navy-100 flex items-center justify-center text-xs">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{member.firstName} {member.lastName}</h4>
                      <p className="text-xs text-gray-400 font-medium">{member.phone || 'No phone'}</p>
                    </div>
                  </div>

                  {/* Note Input */}
                  <div className="flex-1 max-w-md">
                    <input
                      type="text"
                      className="input-field py-1.5 text-xs"
                      placeholder="Add note (e.g. sick leave, travelling...)"
                      value={state.notes}
                      onChange={(e) => handleNotesChange(member._id, e.target.value)}
                    />
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(member._id, 'Present')}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        state.status === 'Present'
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-800 shadow-sm'
                          : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      <Check size={14} />
                      Present
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleStatusChange(member._id, 'Absent')}
                      className={`py-1.5 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${
                        state.status === 'Absent'
                          ? 'bg-red-100 border-red-200 text-red-800 shadow-sm'
                          : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                      }`}
                    >
                      <X size={14} />
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submit Save bar */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving || members.length === 0}
            className="btn-primary px-6 py-2.5 font-bold shadow-md shadow-navy-800/10"
          >
            {saving ? (
              <span>Saving Records...</span>
            ) : (
              <>
                <Save size={18} />
                <span>Save Attendance</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceRecord;
