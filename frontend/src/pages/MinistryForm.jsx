import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createMinistry, updateMinistry, fetchMinistryById, clearSelectedMinistry } from '../features/ministries/ministrySlice';
import { fetchMembers } from '../features/members/memberSlice';
import Spinner from '../components/Spinner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  name: yup.string().required('Ministry name is required'),
  description: yup.string().nullable(),
  leader: yup.string().nullable().transform(value => value === '' ? null : value),
  isActive: yup.boolean().default(true),
});

const MinistryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { item: ministry, loading: ministryLoading } = useSelector((state) => state.ministries);
  const { items: members } = useSelector((state) => state.members);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      leader: '',
      isActive: true,
    }
  });

  useEffect(() => {
    dispatch(fetchMembers({ limit: 100 })); // Load members to assign leader

    if (isEdit) {
      dispatch(fetchMinistryById(id));
    } else {
      dispatch(clearSelectedMinistry());
      reset();
    }

    return () => {
      dispatch(clearSelectedMinistry());
    };
  }, [dispatch, id, isEdit, reset]);

  // Load ministry details into form when editing
  useEffect(() => {
    if (isEdit && ministry) {
      setValue('name', ministry.name);
      setValue('description', ministry.description || '');
      setValue('leader', ministry.leader?._id || ministry.leader || '');
      setValue('isActive', ministry.isActive);
    }
  }, [ministry, isEdit, setValue]);

  const onSubmit = (data) => {
    setSubmitting(true);
    const action = isEdit
      ? dispatch(updateMinistry({ id, data }))
      : dispatch(createMinistry(data));

    action.unwrap()
      .then((res) => {
        toast.success(`Ministry ${isEdit ? 'updated' : 'created'} successfully`);
        navigate(`/ministries/${res._id || id}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to save ministry record');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (isEdit && ministryLoading) return <Spinner size="lg" fullPage />;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(isEdit ? `/ministries/${id}` : '/ministries')} 
          className="btn-secondary text-xs py-1.5 px-3"
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Modify Ministry' : 'Start New Ministry'}
        </h1>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div>
          <label className="label">Ministry Name *</label>
          <input
            type="text"
            className={`input-field ${errors.name ? 'border-red-300' : ''}`}
            placeholder="Worship Ministry"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="label">Group Description</label>
          <textarea
            rows="4"
            className="input-field py-2"
            placeholder="Describe the ministry's role, duties and outreach projects..."
            {...register('description')}
          />
        </div>

        <div>
          <label className="label">Ministry Leader</label>
          <select className="input-field" {...register('leader')}>
            <option value="">Select leader...</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName} {m.phone ? `(${m.phone})` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">
            This member will coordinate and manage ministry affairs.
          </p>
        </div>

        <div className="flex items-center gap-2.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
          <input
            id="isActive"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-navy-800 focus:ring-navy-800 cursor-pointer"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
            This ministry is active
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-6 py-2.5 font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Saving ministry...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEdit ? 'Save Changes' : 'Create Ministry'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MinistryForm;
