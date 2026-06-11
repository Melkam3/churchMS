import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchMinistryById, 
  assignMemberToMinistry, 
  removeMemberFromMinistry 
} from '../features/ministries/ministrySlice';
import { fetchMembers } from '../features/members/memberSlice';
import Spinner from '../components/Spinner';
import { 
  ArrowLeft, 
  Edit2, 
  Users, 
  UserPlus, 
  UserMinus, 
  HeartHandshake, 
  PlusCircle, 
  ShieldAlert, 
  ExternalLink 
} from 'lucide-react';
import { toast } from 'react-toastify';

const MinistryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { item: ministry, loading, error } = useSelector((state) => state.ministries);
  const { items: allMembers } = useSelector((state) => state.members);

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchMinistryById(id));
    dispatch(fetchMembers({ limit: 100 }));
  }, [dispatch, id]);

  const handleAssignMember = (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setAdding(true);
    dispatch(assignMemberToMinistry({ ministryId: id, memberId: selectedMemberId }))
      .unwrap()
      .then(() => {
        toast.success('Member assigned to ministry');
        setSelectedMemberId('');
        dispatch(fetchMinistryById(id)); // reload details
      })
      .catch((err) => {
        toast.error(err || 'Failed to assign member');
      })
      .finally(() => {
        setAdding(false);
      });
  };

  const handleRemoveMember = (memberId, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from this ministry?`)) {
      dispatch(removeMemberFromMinistry({ ministryId: id, memberId }))
        .unwrap()
        .then(() => {
          toast.success(`${name} removed from ministry`);
          dispatch(fetchMinistryById(id)); // reload details
        })
        .catch((err) => {
          toast.error(err || 'Failed to remove member');
        });
    }
  };

  if (loading) return <Spinner size="lg" fullPage />;
  if (error) return <div className="card text-center text-red-500">{error}</div>;
  if (!ministry) return <div className="card text-center text-gray-500">Ministry not found</div>;

  // Filter out members already in this ministry
  const candidateMembers = allMembers.filter(m => 
    !ministry.members?.some(mm => mm._id === m._id || mm === m._id)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back and Edit */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/ministries')} 
          className="btn-secondary text-xs py-1.5 px-3"
        >
          <ArrowLeft size={16} />
          <span>Back to Ministries</span>
        </button>

        <button 
          onClick={() => navigate(`/ministries/${ministry._id}/edit`)}
          className="btn-primary py-1.5 px-3"
        >
          <Edit2 size={16} />
          <span>Edit Details</span>
        </button>
      </div>

      {/* Header Info Panel */}
      <div className="card flex flex-col md:flex-row justify-between items-start gap-6 bg-gradient-to-r from-white to-gray-50/50">
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-navy-50 text-navy-800 border border-navy-100 font-bold text-xl">
              ⛪
            </span>
            <div>
              <h2 className="text-2xl font-black text-gray-800">{ministry.name}</h2>
              <span className={ministry.isActive ? 'badge-active' : 'badge-inactive'}>
                {ministry.isActive ? 'Active Group' : 'Inactive Group'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">{ministry.description || 'No description available.'}</p>
        </div>

        <div className="flex-shrink-0 bg-white p-4 rounded-xl border border-gray-100 min-w-56">
          <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-1">Ministry Leader</span>
          {ministry.leader ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-navy-50 text-navy-800 font-bold flex items-center justify-center text-xs">
                {ministry.leader.firstName?.charAt(0)}{ministry.leader.lastName?.charAt(0)}
              </div>
              <div>
                <p 
                  onClick={() => navigate(`/members/${ministry.leader._id || ministry.leader}`)}
                  className="text-sm font-semibold text-navy-800 hover:underline cursor-pointer"
                >
                  {ministry.leader.firstName} {ministry.leader.lastName}
                </p>
                <p className="text-[10px] text-gray-400 font-medium">{ministry.leader.phone || 'No phone'}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-red-500 font-medium italic flex items-center gap-1.5">
              <ShieldAlert size={14} />
              No Leader Assigned
            </p>
          )}
        </div>
      </div>

      {/* Roster & Assign Member Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roster Table */}
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Users className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Ministry Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="table-header">Name</th>
                  <th className="table-header">Gender</th>
                  <th className="table-header">Membership Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {ministry.members?.map((member) => (
                  <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy-50 text-navy-800 font-bold border border-navy-100 flex items-center justify-center text-xs">
                          {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                        </div>
                        <div className="text-sm font-semibold text-gray-800">
                          {member.firstName} {member.lastName}
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{member.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={member.membershipStatus === 'Active' ? 'badge-active' : 'badge-inactive'}>
                        {member.membershipStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/members/${member._id}`)}
                          className="text-gray-400 hover:text-navy-800 flex items-center gap-1"
                          title="View Profile"
                        >
                          <span>View Profile</span>
                          <ExternalLink size={12} />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member._id, `${member.firstName} ${member.lastName}`)}
                          className="text-gray-400 hover:text-red-600 flex items-center gap-1.5"
                          title="Remove from Ministry"
                        >
                          <UserMinus size={14} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!ministry.members || ministry.members.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-sm text-gray-400 italic">
                      No members enrolled in this ministry yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enroll Member panel */}
        <div className="card space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UserPlus className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Assign Member</h3>
          </div>

          <p className="text-xs text-gray-400">
            Select a congregation member to enroll in this service group.
          </p>

          <form onSubmit={handleAssignMember} className="space-y-4">
            <div>
              <label className="label">Select Member</label>
              <select
                className="input-field"
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
              >
                <option value="">Choose member...</option>
                {candidateMembers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.firstName} {m.lastName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={adding || !selectedMemberId}
              className="btn-primary w-full justify-center text-xs py-2 disabled:opacity-50"
            >
              {adding ? (
                <span>Assigning...</span>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Assign to Ministry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MinistryDetail;
