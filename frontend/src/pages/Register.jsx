import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CameraCapture from '../components/CameraCapture';

const SPECIALIZATIONS = [
  'General Physician', 'Pediatrician', 'Gynecologist', 'Dermatologist',
  'Orthopedic', 'Cardiologist', 'ENT Specialist', 'Dentist',
  'Psychiatrist', 'Ophthalmologist', 'Neurologist', 'General Surgeon',
];

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();

  const [role, setRole] = useState('patient');
  const [photoFile, setPhotoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobile: '',
    age: '', gender: '', village: '',
    specialization: '', experience: '',
  });

  const [selectedCountry, setSelectedCountry] = useState({ value: 'IN', label: 'India' });
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const countryOptions = useMemo(
    () => Country.getAllCountries().map((c) => ({ value: c.isoCode, label: c.name })),
    []
  );

  const stateOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.value).map((s) => ({
      value: s.isoCode,
      label: s.name,
    }));
  }, [selectedCountry]);

  const cityOptions = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];
    return City.getCitiesOfState(selectedCountry.value, selectedState.value).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [selectedCountry, selectedState]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: isDark ? '#1e293b' : '#fff',
      borderColor: isDark ? '#334155' : '#d1d5db',
    }),
    singleValue: (base) => ({ ...base, color: isDark ? '#fff' : '#1f2937' }),
    input: (base) => ({ ...base, color: isDark ? '#fff' : '#1f2937' }),
    menu: (base) => ({ ...base, backgroundColor: isDark ? '#1e293b' : '#fff' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? (isDark ? '#334155' : '#f3f4f6') : 'transparent',
      color: isDark ? '#fff' : '#1f2937',
    }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCountry || !selectedState || !selectedCity) {
      setError('Please select country, state and city.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('mobile', formData.mobile);
      data.append('role', role);
      data.append('country', selectedCountry.label);
      data.append('state', selectedState.label);
      data.append('city', selectedCity.label);
      data.append('village', formData.village);

      if (role === 'patient') {
        data.append('age', formData.age);
        data.append('gender', formData.gender);
      } else {
        data.append('specialization', formData.specialization);
        data.append('experience', formData.experience);
      }

      if (photoFile) {
        data.append('photo', photoFile);
      }

      const res = await API.post('/auth/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      login(res.data.user, res.data.token);
      navigate(role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white p-2 rounded";

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-xl shadow mb-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Create Account</h2>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setRole('patient')}
          className={`flex-1 py-2 rounded ${role === 'patient' ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}
        >
          I'm a Patient
        </button>
        <button
          type="button"
          onClick={() => setRole('doctor')}
          className={`flex-1 py-2 rounded ${role === 'doctor' ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-slate-300'}`}
        >
          I'm a Doctor
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <CameraCapture onCapture={setPhotoFile} />

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className={inputClass} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={inputClass} />
        <input
          type="tel" name="mobile" placeholder="Mobile Number"
          value={formData.mobile} onChange={handleChange} required
          pattern="[0-9]{10}" title="10-digit mobile number"
          className={inputClass}
        />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className={inputClass} />

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 -mb-1">Country</label>
        <Select
          options={countryOptions} value={selectedCountry} styles={selectStyles}
          onChange={(val) => { setSelectedCountry(val); setSelectedState(null); setSelectedCity(null); }}
          placeholder="Search country..."
        />

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 -mb-1">State</label>
        <Select
          options={stateOptions} value={selectedState} styles={selectStyles}
          onChange={(val) => { setSelectedState(val); setSelectedCity(null); }}
          placeholder="Search state..." isDisabled={!selectedCountry}
        />

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 -mb-1">City / District</label>
        <Select
          options={cityOptions} value={selectedCity} styles={selectStyles}
          onChange={setSelectedCity}
          placeholder="Search city..." isDisabled={!selectedState}
        />

        <input type="text" name="village" placeholder="Village / Locality / Area (optional)" value={formData.village} onChange={handleChange} className={inputClass} />

        {role === 'patient' && (
          <>
            <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} className={inputClass} />
            <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </>
        )}

        {role === 'doctor' && (
          <>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300 -mb-1">Specialization</label>
            <Select
              options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))} styles={selectStyles}
              value={formData.specialization ? { value: formData.specialization, label: formData.specialization } : null}
              onChange={(val) => setFormData({ ...formData, specialization: val.value })}
              placeholder="Search specialization..."
            />
            <input type="number" name="experience" placeholder="Years of Experience" value={formData.experience} onChange={handleChange} className={inputClass} />
          </>
        )}

        <button
          type="submit" disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-2 rounded hover:opacity-90 disabled:opacity-50 mt-2"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600 dark:text-slate-400">
        Already have an account? <Link to="/login" className="text-orange-500 dark:text-orange-400">Login</Link>
      </p>
    </div>
  );
}

export default Register;