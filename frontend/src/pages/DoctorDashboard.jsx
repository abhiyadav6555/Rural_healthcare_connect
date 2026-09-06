import { useState, useEffect } from 'react';
import API from '../api/axios';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prescriptionInputs, setPrescriptionInputs] = useState({});
  const [imageInputs, setImageInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, prescription = '', imageFile = null) => {
    setUpdatingId(id);
    try {
      const data = new FormData();
      data.append('status', status);
      if (prescription) data.append('prescription', prescription);
      if (imageFile) data.append('prescriptionImage', imageFile);

      await API.put(`/appointments/${id}/status`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePrescriptionChange = (id, value) => {
    setPrescriptionInputs({ ...prescriptionInputs, [id]: value });
  };

  const handleImageChange = (id, file) => {
    setImageInputs({ ...imageInputs, [id]: file });
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const urgencyColor = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    emergency: 'text-red-600 dark:text-red-400 font-bold',
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 pb-10 text-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      {loading && <p className="text-gray-500 dark:text-slate-500 text-sm">Loading appointments...</p>}
      {!loading && appointments.length === 0 && (
        <p className="text-gray-500 dark:text-slate-500 text-sm">No appointment requests yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {appointments.map((appt) => (
          <div key={appt._id} className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold">{appt.patient?.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-500">
                  {appt.patient?.age} yrs, {appt.patient?.gender}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[appt.status]}`}>
                {appt.status}
              </span>
            </div>

            <p className="text-sm text-gray-700 dark:text-slate-300 mb-1">
              Symptoms: {appt.symptoms}{' '}
              <span className={`ml-2 text-xs uppercase ${urgencyColor[appt.urgencyLevel]}`}>
                ({appt.urgencyLevel})
              </span>
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-500 mb-3">
              Requested: {new Date(appt.date).toLocaleString()}
            </p>

            {appt.patientImage && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Patient attached photo:</p>
                <img
                  src={`http://localhost:5000/uploads/${appt.patientImage}`}
                  alt="Patient attachment"
                  className="w-32 h-32 object-cover rounded border border-gray-200 dark:border-slate-700"
                />
              </div>
            )}

            {appt.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(appt._id, 'accepted')}
                  disabled={updatingId === appt._id}
                  className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(appt._id, 'rejected')}
                  disabled={updatingId === appt._id}
                  className="bg-red-500 text-white px-4 py-1.5 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}

            {appt.status === 'accepted' && (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Enter prescription notes"
                  value={prescriptionInputs[appt._id] || ''}
                  onChange={(e) => handlePrescriptionChange(appt._id, e.target.value)}
                  className="border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white p-2 rounded text-sm"
                />
                <label className="text-xs text-gray-600 dark:text-slate-400">
                  Attach photo (optional — report, prescription scan, etc.)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(appt._id, e.target.files[0])}
                    className="block mt-1 text-sm"
                  />
                </label>
                <button
                  onClick={() =>
                    updateStatus(appt._id, 'completed', prescriptionInputs[appt._id] || '', imageInputs[appt._id])
                  }
                  disabled={updatingId === appt._id}
                  className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-1.5 rounded text-sm hover:opacity-90 disabled:opacity-50 self-start"
                >
                  Mark Completed
                </button>
              </div>
            )}

            {appt.status === 'completed' && (
              <div className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
                {appt.prescription && (
                  <p className="text-sm text-green-800 dark:text-green-400">Prescription: {appt.prescription}</p>
                )}
                {appt.prescriptionImage && (
                  <img
                    src={`http://localhost:5000/uploads/${appt.prescriptionImage}`}
                    alt="Prescription attachment"
                    className="mt-2 w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;