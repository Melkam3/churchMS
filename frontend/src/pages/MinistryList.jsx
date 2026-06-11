import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMinistries, deleteMinistry } from '../features/ministries/ministrySlice';
import Spinner from '../components/Spinner';
import { 
  HeartHandshake, 
  Users, 
  User, 
  Plus, 
  Eye, 
  Edit2, 
  Trash2 
} from 'lucide-react';
import { toast } from 'react-toastify';

const MinistryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: ministries, loading, error } = useSelector((state) => state.ministries);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMinistries({ limit: 100 }));
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the ministry "${name}"?`)) {
      dispatch(deleteMinistry(id))
        .unwrap()
        .then(() => {
          toast.success(`Ministry "${name}" deleted`);
        })
        .catch((err) => {
          toast.error(err || 'Failed to delete ministry');
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
          <h1 className="text-2xl font-bold text-gray-800">Church Ministries</h1>
          <p className="text-sm text-gray-400">View and support church service groups</p>
        </div>
        <button
          onClick={() => navigate('/ministries/new')}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>New Ministry</span>
        </button>
      </div>

      {/* Grid of Ministries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ministries.map((ministry) => (
          <div 
            key={ministry._id} 
            className="card flex flex-col justify-between space-y-4 hover:shadow-md transition-all group border-t-4 border-t-navy-800"
          >
            {/* Title & Status */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-navy-800 transition-colors">
                  {ministry.name}
                </h3>
                {ministry.leader ? (
                  <p className="text-xs text-gray-500 font-semibold mt-1">
                    Leader:{' '}
                    <span 
                      onClick={() => navigate(`/members/${ministry.leader._id || ministry.leader}`)}
                      className="text-navy-800 hover:underline cursor-pointer"
                    >
                      {ministry.leader.firstName ? `${ministry.leader.firstName} ${ministry.leader.lastName}` : 'View Profile'}
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-red-500 italic mt-1">No leader assigned</p>
                )}
              </div>
              <span className={ministry.isActive ? 'badge-active' : 'badge-inactive'}>
                {ministry.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
              {ministry.description || 'No description provided.'}
            </p>

            {/* Member Count */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-navy-800 bg-navy-50/50 py-1.5 px-3 rounded-lg w-fit border border-navy-100/30">
              <Users size={14} />
              <span>{ministry.members?.length || 0} Members enrolled</span>
            </div>

            {/* Footer Action Panel */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-3">
              <button 
                onClick={() => navigate(`/ministries/${ministry._id}`)}
                className="text-xs font-bold text-navy-800 hover:text-navy-950 hover:underline flex items-center gap-1"
              >
                <Eye size={14} />
                <span>View Ministry</span>
              </button>
              
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => navigate(`/ministries/${ministry._id}/edit`)}
                  className="p-1 rounded hover:bg-navy-50 hover:text-navy-800 text-gray-400 transition-colors"
                  title="Edit Ministry"
                >
                  <Edit2 size={14} />
                </button>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(ministry._id, ministry.name)}
                    className="p-1 rounded hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors"
                    title="Delete Ministry"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {ministries.length === 0 && (
          <div className="card md:col-span-3 text-center py-12 text-gray-400 italic">
            No ministries registered yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MinistryList;
