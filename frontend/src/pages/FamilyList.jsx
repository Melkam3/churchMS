import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFamilies, deleteFamily } from '../features/families/familySlice';
import Spinner from '../components/Spinner';
import { 
  Users, 
  MapPin, 
  Phone, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2,
  Home
} from 'lucide-react';
import { toast } from 'react-toastify';

const FamilyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: families, loading, error } = useSelector((state) => state.families);
  const { user } = useSelector((state) => state.auth); // Role checks

  useEffect(() => {
    dispatch(fetchFamilies({ limit: 100 }));
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove the family reference from all associated members.`)) {
      dispatch(deleteFamily(id))
        .unwrap()
        .then(() => {
          toast.success(`${name} deleted successfully`);
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete family');
        });
    }
  };

  if (loading) return <Spinner size="lg" fullPage />;
  if (error) return <div className="card text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Family Units</h1>
          <p className="text-sm text-gray-400">View and organize family households</p>
        </div>
        <button
          onClick={() => navigate('/families/new')}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Create Family</span>
        </button>
      </div>

      {/* Grid of Family Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {families.map((family) => (
          <div key={family._id} className="card flex flex-col justify-between space-y-4 hover:shadow-md transition-all group border-t-4 border-t-navy-800">
            {/* Title & Members Count */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-navy-800 transition-colors">
                  {family.familyName}
                </h3>
                {family.headOfFamily ? (
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Head:{' '}
                    <span 
                      onClick={() => navigate(`/members/${family.headOfFamily._id || family.headOfFamily}`)}
                      className="text-navy-800 hover:underline cursor-pointer"
                    >
                      {family.headOfFamily.firstName ? `${family.headOfFamily.firstName} ${family.headOfFamily.lastName}` : 'View Profile'}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-red-500 italic mt-1">No head assigned</p>
                )}
              </div>
              <span className="bg-navy-50 text-navy-800 text-xs font-bold py-1 px-2.5 rounded-full border border-navy-100 flex items-center gap-1.5">
                <Users size={12} />
                {family.members?.length || 0}
              </span>
            </div>

            {/* Quick Details */}
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-50 pt-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="truncate">{family.address || 'No address registered'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" />
                <span>{family.phone || 'No phone registered'}</span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
              <button 
                onClick={() => navigate(`/families/${family._id}`)}
                className="text-xs font-bold text-navy-800 hover:text-navy-950 hover:underline flex items-center gap-1"
              >
                <Eye size={14} />
                <span>View Household</span>
              </button>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(`/families/${family._id}/edit`)}
                  className="p-1 rounded hover:bg-navy-50 hover:text-navy-800 text-gray-400 transition-colors"
                  title="Edit Family"
                >
                  <Edit2 size={14} />
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(family._id, family.familyName)}
                    className="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                    title="Delete Family"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {families.length === 0 && (
          <div className="card md:col-span-3 text-center py-12 text-gray-400 italic">
            No family units found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyList;
