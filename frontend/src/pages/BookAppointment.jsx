import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import CameraCapture from '../components/CameraCapture';

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ symptoms: '', urgencyLevel: 'low', date: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('doctorId', doctorId);
      data.append('symptoms', formData.symptoms);
      data.append('urgencyLevel', formData.urgencyLevel);
      data.append('date', formData.date);
      if (photoFile) data.append('patientImage', photoFile);

      await API.post('/appointments', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => navigate('/patient-dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-xl shadow text-center text-gray-800 dark:text-white">
        <p className="text-green-600 dark:text-green-400 font-semibold text-lg mb-2">Appointment Requested!</p>
        <p className="text-gray-500 dark:text-slate-500 text-sm">Redirecting to your dashboard...</p>
      </div>
    );
  }

  const inputClass = "border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white p-2 rounded";

  return (
    <div className="max-w-md mx-auto mt-10 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-8 rounded-xl shadow text-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Preferred Date & Time</label>
        <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required className={inputClass} />

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Describe your symptoms</label>
        <textarea
          name="symptoms" rows="3" placeholder="e.g. fever, headache since 2 days"
          value={formData.symptoms} onChange={handleChange} required className={inputClass}
        />

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Urgency</label>
        <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange} className={inputClass}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="emergency">Emergency</option>
        </select>

        <label className="text-sm font-medium text-gray-700 dark:text-slate-300 -mb-1">
          Attach a photo (optional — injury, rash, report, etc.)
        </label>
        <CameraCapture onCapture={setPhotoFile} />

        <button
          type="submit" disabled={loading}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-2 rounded hover:opacity-90 disabled:opacity-50 mt-2"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookAppointment;