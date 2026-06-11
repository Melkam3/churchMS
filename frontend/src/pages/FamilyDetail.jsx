import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFamilyById, addMemberToFamily } from '../features/families/familySlice';
import { fetchMembers } from '../features/members/memberSlice';
import Spinner from '../components/Spinner';
import { 
  ArrowLeft, 
  Edit2, 
  MapPin, 
  Phone, 
  User, 
  UserPlus, 
  Users, 
  PlusCircle, 
  ExternalLink 
} from 'lucide-react';
import { toast } from 'react-toastify';

const FamilyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { item: family, loading, error } = useSelector((state) => state.families);
  const { items: allMembers } = useSelector((state) => state.members);

  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchFamilyById(id));
    dispatch(fetchMembers({ limit: 100 })); // Load members to assign
  }, [dispatch, id]);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    setAdding(true);
    dispatch(addMemberToFamily({ familyId: id, memberId: selectedMemberId }))
      .unwrap()
      .then(() => {
        toast.success('Member added to family');
        setSelectedMemberId('');
        dispatch(fetchFamilyById(id)); // Reload family details
      })
      .catch((err) => {
        toast.error(err || 'Failed to add member');
      })
      .finally(() => {
        setAdding(false);
      });
  };

  if (loading) return <Spinner size="lg" fullPage />;
  if (error) return <div className="card text-center text-red-500">{error}</div>;
  if (!family) return <div className="card text-center text-gray-500">Family not found</div>;

  // Filter members that are not already in this family
  const candidateMembers = allMembers.filter(m => 
    !family.members?.some(fm => fm._id === m._id || fm === m._id)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back & Edit Action Panel */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate('/families')} 
          className="btn-secondary text-xs py-1.5 px-3"
        >
          <ArrowLeft size={16} />
          <span>Back to Families</span>
        </button>

        <button 
          onClick={() => navigate(`/families/${family._id}/edit`)}
          className="btn-primary py-1.5 px-3"
        >
          <Edit2 size={16} />
          <span>Edit Details</span>
        </button>
      </div>

      {/* Household Overview Header Card */}
      <div className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-white to-gray-50/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-xl bg-navy-50 text-navy-800 border border-navy-100 font-bold text-xl">
              🏠
            </span>
            <div>
              <h2 className="text-2xl font-black text-gray-800">{family.familyName}</h2>
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Household Profile</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{family.address || 'No Address registered'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <span>{family.phone || 'No Phone registered'}</span>
          </div>
        </div>
      </div>

      {/* Roster & Adding panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Roster Table */}
        <div className="card lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <Users className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Family Members Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="table-header">Name</th>
                  <th className="table-header">Gender</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {family.members?.map((member) => {
                  const isHead = family.headOfFamily && 
                    (family.headOfFamily === member._id || family.headOfFamily._id === member._id);
                  return (
                    <tr key={member._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy-50 text-navy-800 font-bold border border-navy-100 flex items-center justify-center text-xs">
                            {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {member.firstName} {member.lastName}
                            </div>
                            {isHead && (
                              <span className="text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                Head of Family
                              </span>
                            )}
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
                        <button
                          onClick={() => navigate(`/members/${member._id}`)}
                          className="text-navy-800 hover:text-navy-950 font-bold flex items-center gap-1 ml-auto"
                        >
                          <span>View Profile</span>
                          <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {(!family.members || family.members.length === 0) && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-sm text-gray-400 italic">
                      No members registered in this family unit yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Member form */}
        <div className="card space-y-4 h-fit">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
            <UserPlus className="text-navy-800" size={20} />
            <h3 className="text-lg font-bold text-gray-800">Enroll Member</h3>
          </div>

          <p className="text-xs text-gray-400">
            Assign an existing congregation member to this family household unit.
          </p>

          <form onSubmit={handleAddMember} className="space-y-4">
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
                    {m.firstName} {m.lastName} {m.phone ? `(${m.phone})` : ''}
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
                <span>Enrolling...</span>
              ) : (
                <>
                  <PlusCircle size={16} />
                  <span>Add to Household</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FamilyDetail;
