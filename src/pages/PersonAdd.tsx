import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { usePerson } from '../context/PersonContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MaskedInput from 'react-text-mask';
import type { FormData } from '../types';
import { 
  ChevronDownIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required').matches(/^[a-zA-Z\s]*$/, 'First name should not contain special characters'),
  lastName: yup.string().required('Last name is required').matches(/^[a-zA-Z\s]*$/, 'Last name should not contain special characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phone: yup.string().required('Phone number is required').matches(/^[1-9]\d{9}$/, 'Phone number must be 10 digits starting with 1-9'),
  state: yup.string().required('State is required'),
  city: yup.string().required('City is required'),
});

const PersonAdd = () => {
  const { addPerson } = usePerson();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    control,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const selectedState = watch('state');

  const onSubmit = (data: FormData) => {
    addPerson(data);
    setShowModal(true);
  };

  const handleAddAnother = () => {
    reset(); // Reset form
    setShowModal(false);
  };

  const handleGoToList = () => {
    navigate('/list');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-[#1e293b]/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl shadow-slate-900/40 border border-slate-700/50 p-6 sm:p-8 md:py-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-100 mb-6 sm:mb-8">Add New Person</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Basic Fields */}
          {[
            { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
            { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter email' },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">{label}</label>
              <input
                type={type}
                {...register(name as keyof FormData)}
                className="w-full rounded-full bg-[#1f2937] text-slate-100 border border-transparent placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 px-3 sm:px-4 py-2 text-sm transition-all duration-200"
                placeholder={placeholder}
              />
              {errors[name as keyof typeof errors] && (
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors[name as keyof typeof errors]?.message}</p>
              )}
            </div>
          ))}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">Phone</label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  {...field}
                  mask={[/[1-9]/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                  guide={false}
                  placeholder="Enter phone number"
                  className="w-full rounded-full bg-[#1f2937] text-slate-100 border border-transparent placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 px-3 sm:px-4 py-2 text-sm transition-all duration-200"
                />
              )}
            />
            {errors.phone && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.phone.message}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">State</label>
            <div className="relative">
              <select
                {...register('state')}
                className="w-full rounded-full bg-[#1f2937] text-slate-100 border border-transparent placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 px-3 sm:px-4 py-2 text-sm transition-all duration-200 appearance-none"
              >
                <option value="">Select a state</option>
                {['MH', 'DL', 'KA', 'TN', 'UP', 'WB', 'RJ', 'GJ', 'AP', 'MP'].map((code) => (
                  <option key={code} value={code}>
                    {
                      {
                        MH: 'Maharashtra',
                        DL: 'Delhi',
                        KA: 'Karnataka',
                        TN: 'Tamil Nadu',
                        UP: 'Uttar Pradesh',
                        WB: 'West Bengal',
                        RJ: 'Rajasthan',
                        GJ: 'Gujarat',
                        AP: 'Andhra Pradesh',
                        MP: 'Madhya Pradesh',
                      }[code]
                    }
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            {errors.state && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.state.message}</p>}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">City</label>
            <div className="relative">
              <select
                {...register('city')}
                disabled={!selectedState}
                className="w-full rounded-full bg-[#1f2937] text-slate-100 border border-transparent placeholder-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500 px-3 sm:px-4 py-2 text-sm transition-all duration-200 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a city</option>
                {(() => {
                  const citiesMap: Record<string, string[]> = {
                    MH: ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
                    DL: ['New Delhi', 'Dwarka', 'Noida', 'Gurgaon'],
                    KA: ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
                    TN: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
                    UP: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'],
                    WB: ['Kolkata', 'Siliguri', 'Howrah', 'Durgapur'],
                    RJ: ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'],
                    GJ: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
                    AP: ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur'],
                    MP: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
                  };
                  return (citiesMap[selectedState] || []).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ));
                })()}
              </select>
              <ChevronDownIcon className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
            {errors.city && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-400">{errors.city.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold tracking-wide py-2.5 sm:py-3 px-4 sm:px-6 rounded-full transition-all duration-300 shadow-lg border border-transparent hover:border-violet-500 hover:shadow-violet-500/30 hover:brightness-110 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Add Person
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
          <div className="bg-[#1f1f1f] p-6 sm:p-8 rounded-xl border border-gray-700 shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md text-center animate-fade-in">
            <div className="flex justify-center mb-4 sm:mb-6">
              <CheckCircleIcon className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 stroke-[1.5]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Person Added Successfully</h3>

            <div className="flex flex-row sm:flex-col md:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleAddAnother}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-lg text-center w-full sm:w-auto font-medium hover:border hover:border-violet-500 hover:shadow-violet-500/30 hover:cursor-pointer transition-all duration-200"
              >
                Add Another
              </button>
              <button
                onClick={handleGoToList}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded-lg text-center w-full sm:w-auto font-medium hover:border hover:border-violet-500 hover:shadow-violet-500/30 hover:cursor-pointer transition-all duration-200"
              >
                View Directory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonAdd;
