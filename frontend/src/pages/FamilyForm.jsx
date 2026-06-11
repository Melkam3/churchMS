import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createFamily, updateFamily, fetchFamilyById, clearSelectedFamily } from '../features/families/familySlice';
import { fetchMembers } from '../features/members/memberSlice';
import Spinner from '../components/Spinner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  familyName: yup.string().required('Family name is required'),
  headOfFamily: yup.string().nullable().transform(value => value === '' ? null : value),
  address: yup.string().nullable(),
  phone: yup.string().nullable(),
});

const FamilyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { item: family, loading: familyLoading } = useSelector((state) => state.families);
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
      familyName: '',
      headOfFamily: '',
      address: '',
      phone: ''
    }
  });

  useEffect(() => {
    dispatch(fetchMembers({ limit: 100 })); // Load members to choose head of family

    if (isEdit) {
      dispatch(fetchFamilyById(id));
    } else {
      dispatch(clearSelectedFamily());
      reset();
    }

    return () => {
      dispatch(clearSelectedFamily());
    };
  }, [dispatch, id, isEdit, reset]);

  // Load family details into form when editing
  useEffect(() => {
    if (isEdit && family) {
      setValue('familyName', family.familyName);
      setValue('headOfFamily', family.headOfFamily?._id || family.headOfFamily || '');
      setValue('address', family.address || '');
      setValue('phone', family.phone || '');
    }
  }, [family, isEdit, setValue]);

  const onSubmit = (data) => {
    setSubmitting(true);
    const action = isEdit
      ? dispatch(updateFamily({ id, data }))
      : dispatch(createFamily(data));

    action.unwrap()
      .then((res) => {
        toast.success(`Family ${isEdit ? 'updated' : 'created'} successfully`);
        navigate(`/families/${res._id || id}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to save family record');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (isEdit && familyLoading) return <Spinner size="lg" fullPage />;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(isEdit ? `/families/${id}` : '/families')} 
          className="btn-secondary text-xs py-1.5 px-3"
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Modify Family Unit' : 'Create New Family Unit'}
        </h1>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div>
          <label className="label">Family / Household Name *</label>
          <input
            type="text"
            className={`input-field ${errors.familyName ? 'border-red-300' : ''}`}
            placeholder="Doe Family"
            {...register('familyName')}
          />
          {errors.familyName && <p className="text-xs text-red-500 mt-1">{errors.familyName.message}</p>}
        </div>

        <div>
          <label className="label">Head of Family</label>
          <select className="input-field" {...register('headOfFamily')}>
            <option value="">Select a member...</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName} {m.phone ? `(${m.phone})` : ''}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">
            This member will be marked as the head/representative of the household.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Family Contact Phone</label>
            <input
              type="text"
              className="input-field"
              placeholder="+251911000001"
              {...register('phone')}
            />
          </div>

          <div>
            <label className="label">Household Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="123 Main St, Addis Ababa"
              {...register('address')}
            />
          </div>
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
                <span>Saving household...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEdit ? 'Save Changes' : 'Create Household'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyForm;
