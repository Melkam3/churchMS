import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createMember, updateMember, fetchMemberById, clearSelectedMember } from '../features/members/memberSlice';
import { fetchFamilies } from '../features/families/familySlice';
import Spinner from '../components/Spinner';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  middleName: yup.string().nullable(),
  lastName: yup.string().required('Last name is required'),
  gender: yup.string().oneOf(['Male', 'Female']).required('Gender is required'),
  dateOfBirth: yup.string().nullable(),
  phone: yup.string().nullable(),
  email: yup.string().email('Invalid email address').nullable().transform(value => value === '' ? null : value),
  address: yup.string().nullable(),
  occupation: yup.string().nullable(),
  baptismStatus: yup.string().oneOf(['Baptized', 'Not Baptized', 'Pending']).required(),
  membershipStatus: yup.string().oneOf(['Active', 'Inactive', 'Transferred', 'Deceased']).required(),
  joinDate: yup.string().required('Join date is required'),
  family: yup.string().nullable().transform(value => value === '' ? null : value),
});

const MemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = !!id;

  const { item: member, loading: memberLoading } = useSelector((state) => state.members);
  const { items: families } = useSelector((state) => state.families);
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
      baptismStatus: 'Not Baptized',
      membershipStatus: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      family: ''
    }
  });

  useEffect(() => {
    dispatch(fetchFamilies({ limit: 100 }));
    
    if (isEdit) {
      dispatch(fetchMemberById(id));
    } else {
      dispatch(clearSelectedMember());
      reset();
    }
    
    return () => {
      dispatch(clearSelectedMember());
    };
  }, [dispatch, id, isEdit, reset]);

  // Load member data into form when editing
  useEffect(() => {
    if (isEdit && member) {
      setValue('firstName', member.firstName);
      setValue('middleName', member.middleName || '');
      setValue('lastName', member.lastName);
      setValue('gender', member.gender);
      if (member.dateOfBirth) {
        setValue('dateOfBirth', new Date(member.dateOfBirth).toISOString().split('T')[0]);
      }
      setValue('phone', member.phone || '');
      setValue('email', member.email || '');
      setValue('address', member.address || '');
      setValue('occupation', member.occupation || '');
      setValue('baptismStatus', member.baptismStatus);
      setValue('membershipStatus', member.membershipStatus);
      if (member.joinDate) {
        setValue('joinDate', new Date(member.joinDate).toISOString().split('T')[0]);
      }
      setValue('family', member.family?._id || member.family || '');
    }
  }, [member, isEdit, setValue]);

  const onSubmit = (data) => {
    setSubmitting(true);
    const action = isEdit 
      ? dispatch(updateMember({ id, data }))
      : dispatch(createMember(data));

    action.unwrap()
      .then((res) => {
        toast.success(`Member ${isEdit ? 'updated' : 'created'} successfully`);
        navigate(`/members/${res._id || id}`);
      })
      .catch((err) => {
        toast.error(err || 'Failed to save member');
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  if (isEdit && memberLoading) return <Spinner size="lg" fullPage />;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(isEdit ? `/members/${id}` : '/members')} 
          className="btn-secondary text-xs py-1.5 px-3"
        >
          <ArrowLeft size={16} />
          <span>Cancel</span>
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {isEdit ? 'Edit Congregation Member' : 'Register New Member'}
        </h1>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-8">
        {/* Personal Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Personal Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                className={`input-field ${errors.firstName ? 'border-red-300' : ''}`}
                placeholder="John"
                {...register('firstName')}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="label">Middle Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Michael"
                {...register('middleName')}
              />
            </div>

            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                className={`input-field ${errors.lastName ? 'border-red-300' : ''}`}
                placeholder="Doe"
                {...register('lastName')}
              />
              {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Gender *</label>
              <select
                className={`input-field ${errors.gender ? 'border-red-300' : ''}`}
                {...register('gender')}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender.message}</p>}
            </div>

            <div>
              <label className="label">Date of Birth</label>
              <input
                type="date"
                className="input-field"
                {...register('dateOfBirth')}
              />
            </div>

            <div>
              <label className="label">Occupation</label>
              <input
                type="text"
                className="input-field"
                placeholder="Engineer"
                {...register('occupation')}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Phone Number</label>
              <input
                type="text"
                className="input-field"
                placeholder="+251911000001"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className={`input-field ${errors.email ? 'border-red-300' : ''}`}
                placeholder="john.doe@example.com"
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Residential Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="123 Main St, Addis Ababa"
              {...register('address')}
            />
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Church Affiliation */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Church Record</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Baptism Status</label>
              <select className="input-field" {...register('baptismStatus')}>
                <option value="Not Baptized">Not Baptized</option>
                <option value="Baptized">Baptized</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="label">Membership Status</label>
              <select className="input-field" {...register('membershipStatus')}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>

            <div>
              <label className="label">Join Date *</label>
              <input
                type="date"
                className={`input-field ${errors.joinDate ? 'border-red-300' : ''}`}
                {...register('joinDate')}
              />
              {errors.joinDate && <p className="text-xs text-red-500 mt-1">{errors.joinDate.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Family Unit Association</label>
              <select className="input-field" {...register('family')}>
                <option value="">Unassigned (None)</option>
                {families.map((f) => (
                  <option key={f._id} value={f._id}>{f.familyName}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary px-6 py-2.5 font-semibold shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Saving member...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>{isEdit ? 'Save Changes' : 'Register Member'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberForm;
