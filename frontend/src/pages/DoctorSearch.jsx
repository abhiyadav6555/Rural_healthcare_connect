import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { State, City } from 'country-state-city';
import API from '../api/axios';
import { useTheme } from '../context/ThemeContext';

const SPECIALIZATIONS = [
  'General Physician', 'Pediatrician', 'Gynecologist', 'Dermatologist',
  'Orthopedic', 'Cardiologist', 'ENT Specialist', 'Dentist',
  'Psychiatrist', 'Ophthalmologist', 'Neurologist', 'General Surgeon',
];

function DoctorSearch() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [specialization, setSpecialization] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const stateOptions = useMemo(
    () => State.getStatesOfCountry('IN').map((s) => ({ value: s.isoCode, label: s.name })),
    []
  );

  const cityOptions = useMemo(() => {
    if (!selectedState) return [];
    return City.getCitiesOfState('IN', selectedState.value).map((c) => ({
      value: c.name,
      label: c.name,
    }));
  }, [selectedState]);

  const fetchDoctors = async (spec, city) => {
    setLoading(true);
    try {
      const params = {};
      if (spec) params.specialization = spec;
      if (city) params.location = city;

      const res = await API.get('/doctors', { params });
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors(specialization?.value, selectedCity?.value);
  };

  const selectStyles = {
    control: (base) => ({ ...base, backgroundColor: isDark ? '#1e293b' : '#fff', borderColor: isDark ? '#334155' : '#d1d5db' }),
    singleValue: (base) => ({ ...base, color: isDark ? '#fff' : '#1f2937' }),
    input: (base) => ({ ...base, color: isDark ? '#fff' : '#1f2937' }),
    menu: (base) => ({ ...base, backgroundColor: isDark ? '#1e293b' : '#fff' }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? (isDark ? '#334155' : '#f3f4f6') : 'transparent',
      color: isDark ? '#fff' : '#1f2937',
    }),
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 pb-10 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Find a Doctor</h1>

      <form onSubmit={handleSearch} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 rounded-lg shadow mb-6 flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">Specialization</label>
            <Select
              options={SPECIALIZATIONS.map((s) => ({ value: s, label: s }))}
              value={specialization} onChange={setSpecialization} styles={selectStyles}
              placeholder="Search specialization..." isClearable
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">State</label>
            <Select
              options={stateOptions} value={selectedState} styles={selectStyles}
              onChange={(val) => { setSelectedState(val); setSelectedCity(null); }}
              placeholder="Search state..." isClearable
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">City / District</label>
            <Select
              options={cityOptions} value={selectedCity} styles={selectStyles}
              onChange={setSelectedCity}
              placeholder="Search city..." isDisabled={!selectedState} isClearable
            />
          </div>
        </div>

        <button type="submit" className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 self-start">
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500 dark:text-slate-500 text-sm">Loading doctors...</p>}
      {!loading && doctors.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500 text-sm">No doctors found. Try different filters.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => (
          <div key={doc._id} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow flex gap-4">
            <img
              src={doc.photo ? `http://localhost:5000/uploads/${doc.photo}` : 'https://via.placeholder.com/80?text=Dr'}
              alt={doc.name}
              className="w-16 h-16 rounded-full object-cover border border-gray-200 dark:border-slate-700 shrink-0"
            />
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="font-semibold text-lg">Dr. {doc.name}</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">{doc.specialization || 'General Physician'}</p>
              <p className="text-sm text-gray-500 dark:text-slate-500">{doc.experience || 0} years experience</p>
              <p className="text-sm text-gray-500 dark:text-slate-500">📍 {doc.city}, {doc.state}</p>
              <p className="text-sm text-gray-500 dark:text-slate-500">📞 {doc.mobile}</p>
              <button
                onClick={() => navigate(`/book/${doc._id}`)}
                className="mt-2 bg-gradient-to-r from-orange-500 to-blue-500 text-white py-1.5 rounded hover:opacity-90 text-sm"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorSearch;