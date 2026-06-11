import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMemberById, uploadMemberPhoto } from '../features/members/memberSlice';
import { fetchMinistries } from '../features/ministries/ministrySlice';
import axiosInstance from '../services/axiosInstance';
import Spinner from '../components/Spinner';
import { 
  ArrowLeft, 
  Edit2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Camera, 
  Users, 
  HeartHandshake, 
  ClipboardCheck,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const MemberDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { item: member, loading, error } = useSelector((state) => state.members);
  const { items: ministries } = useSelector((state) => state.ministries);
  
  const [uploading, setUploading] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  // Fetch Member, Ministries, and Attendance History
  useEffect(() => {
    dispatch(fetchMemberById(id));
    dispatch(fetchMinistries({ limit: 100 }));
    
    const fetchMemberAttendance = async () => {
      try {
        setLoadingAttendance(true);
        const res = await axiosInstance.get('/attendance', { params: { memberId: id, limit: 100 } });
        setAttendanceHistory(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAttendance(false);
      }
    };
    fetchMemberAttendance();
  }, [dispatch, id]);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    dispatch(uploadMemberPhoto({ id, formData }))
      .unwrap()
      .then(() => {
        toast.success('Profile photo uploaded successfully');
      })
      .catch((err) => {
        toast.error(err || 'Failed to upload photo');
      })
      .finally(() => {
        setUploading(false);
      });
  };

  if (loading) return <Spinner size="lg" fullPage />;
  if (error) return <div className="card text-center text-red-500">{error}</div>;
  if (!member) return <div className="card text-center text-gray-500">Member not found</div>;

  // Filter ministries this member is in
  const memberMinistries = ministries.filter(m => 
    m.members?.some(mId => mId === id || mId._id === id)
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/members')} 
        className="btn-secondary text-xs py-1.5 px-3"
      >
        <ArrowLeft size={16} />
        <span>Back to Members</span>
      </button>

      {/* Main Profile Info Card */}
      <div className="card p-8 flex flex-col md:flex-row gap-8 items-start relative">
        {/* Photo Upload / View Area */}
        <div className="relative group mx-auto md:mx-0 flex-shrink-0">
          {member.profilePhoto ? (
            <img 
              src={`http://localhost:5000${member.profilePhoto}`} 
              alt={member.firstName} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-navy-50 shadow-md"
            />
          ) : (
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-navy-50 border-4 border-navy-50 shadow-md flex items-center justify-center font-black text-navy-800 text-3xl md:text-4xl">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </div>
          )}
          
          <label className="absolute bottom-1 right-1 bg-navy-800 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-navy-900 border border-white/20 transition-all hover:scale-105">
            {uploading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <Camera size={16} />
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload} 
              disabled={uploading}
            />
          </label>
        </div>

        {/* Member Details Summary */}
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-800">{member.firstName} {member.middleName} {member.lastName}</h2>
              <div className="mt-1.5 flex flex-wrap justify-center md:justify-start gap-2">
                <span className={member.membershipStatus === 'Active' ? 'badge-active' : 'badge-inactive'}>
                  {member.membershipStatus} Status
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {member.baptismStatus}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(`/members/${member._id}/edit`)}
              className="btn-primary self-center md:self-start py-2 px-4 shadow-sm"
            >
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* Quick info grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Mail size={18} className="text-gray-400" />
              <span>{member.email || 'No Email Address'}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Phone size={18} className="text-gray-400" />
              <span>{member.phone || 'No Phone Number'}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <MapPin size={18} className="text-gray-400" />
              <span>{member.address || 'No Address Listed'}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Briefcase size={18} className="text-gray-400" />
              <span>{member.occupation || 'No Occupation Listed'}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Calendar size={18} className="text-gray-400" />
              <span>Born: {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <Calendar size={18} className="text-gray-400" />
              <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Relational details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Family Unit Card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Users className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Family Association</h3>
          </div>
          
          {member.family ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-navy-950 text-sm">{member.family.familyName}</p>
                <p className="text-xs text-gray-400 mt-1">Head of Family ID: {member.family.headOfFamily}</p>
              </div>
              <button 
                onClick={() => navigate(`/families/${member.family._id || member.family}`)}
                className="text-xs font-bold text-navy-800 hover:text-navy-900 underline"
              >
                View Family Profile
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 italic">Not connected to a family unit</p>
              <button 
                onClick={() => navigate('/families/new')}
                className="mt-3 text-xs font-bold text-navy-800 hover:text-navy-900 hover:underline"
              >
                Create a Family Unit
              </button>
            </div>
          )}
        </div>

        {/* Ministries Card */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <HeartHandshake className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Ministry Memberships</h3>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {memberMinistries.map((ministry) => (
              <div 
                key={ministry._id}
                onClick={() => navigate(`/ministries/${ministry._id}`)}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-navy-100 hover:bg-navy-50/10 cursor-pointer transition-colors"
              >
                <span className="text-sm font-semibold text-gray-700">{ministry.name}</span>
                <span className={ministry.isActive ? 'badge-active' : 'badge-inactive'}>
                  {ministry.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            ))}
            
            {memberMinistries.length === 0 && (
              <p className="text-center py-6 text-sm text-gray-400 italic">
                Not enrolled in any ministries
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History Log */}
      <div className="card space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <ClipboardCheck className="text-navy-800" size={20} />
          <h3 className="text-lg font-bold text-gray-800">Congregation Attendance Log</h3>
        </div>

        {loadingAttendance ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="table-header">Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header">Notes</th>
                  <th className="table-header">Recorded By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {attendanceHistory.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-semibold">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
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
                    <td className="table-cell text-xs text-gray-400">
                      {record.recordedBy?.name || 'System Operator'}
                    </td>
                  </tr>
                ))}
                {attendanceHistory.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-sm text-gray-400 italic">
                      No attendance records logged for this member.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberDetail;
