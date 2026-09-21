import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const ALL_SYMPTOMS = [
  'fever', 'headache', 'cough', 'cold', 'body pain',
  'chest pain', 'difficulty breathing', 'severe bleeding',
  'high fever', 'persistent vomiting', 'severe headache',
];

function PatientDashboard() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);

  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

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
      setLoadingAppointments(false);
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const checkSymptoms = async () => {
    if (selectedSymptoms.length === 0) return;
    setChecking(true);
    setResult(null);
    try {
      const res = await API.post('/symptoms/check', { symptoms: selectedSymptoms });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const urgencyColor = {
    low: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    emergency: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  };

  const cardClass = "bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow";

  return (
    <div className="max-w-4xl w-full mx-auto mt-8 px-4 pb-10 text-gray-800 dark:text-white overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      {/* Symptom Checker */}
      <div className={`${cardClass} p-6 mb-8`}>
        <h2 className="text-lg font-semibold mb-4">Symptom Checker</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {ALL_SYMPTOMS.map((symptom) => (
            <button
              key={symptom}
              onClick={() => toggleSymptom(symptom)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedSymptoms.includes(symptom)
                  ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white border-transparent'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-700'
              }`}
            >
              {symptom}
            </button>
          ))}
        </div>
        <button
          onClick={checkSymptoms}
          disabled={checking || selectedSymptoms.length === 0}
          className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check Symptoms'}
        </button>

        {result && (
          <div className={`mt-4 p-4 rounded border ${urgencyColor[result.urgencyLevel]}`}>
            <p className="font-semibold uppercase text-sm mb-1">Urgency: {result.urgencyLevel}</p>
            <p className="text-sm mb-3">{result.advice}</p>
            <Link
              to="/search-doctors"
              className="inline-block bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-1.5 rounded text-sm hover:opacity-90"
            >
              Find a Doctor
            </Link>
          </div>
        )}
      </div>

      {/* My Appointments */}
      <div className={`${cardClass} p-6`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Appointments</h2>
          <Link to="/search-doctors" className="text-orange-500 dark:text-orange-400 text-sm hover:underline">
            + Book New Appointment
          </Link>
        </div>

        {loadingAppointments && <p className="text-gray-500 dark:text-slate-500 text-sm">Loading...</p>}
        {!loadingAppointments && appointments.length === 0 && (
          <p className="text-gray-500 dark:text-slate-500 text-sm">No appointments yet.</p>
        )}

        <div className="flex flex-col gap-3">
          {appointments.map((appt) => (
            <div key={appt._id} className="border border-gray-200 dark:border-slate-800 rounded p-4 flex justify-between items-start">
              <div>
                <p className="font-medium">Dr. {appt.doctor?.name}</p>
                <p className="text-sm text-gray-500 dark:text-slate-500">{appt.doctor?.specialization}</p>
                <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">Symptoms: {appt.symptoms}</p>
                <p className="text-sm text-gray-500 dark:text-slate-500">
                  Date: {new Date(appt.date).toLocaleString()}
                </p>

                {appt.patientImage && (
                  <img
                    src={`http://localhost:5000/uploads/${appt.patientImage}`}
                    alt="Your attachment"
                    className="mt-2 w-20 h-20 object-cover rounded border border-gray-200 dark:border-slate-700"
                  />
                )}

                {appt.prescription && (
                  <div className="mt-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
                    <p className="text-sm text-green-800 dark:text-green-400 font-medium">
                      📋 Prescription (Permanent Record)
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">{appt.prescription}</p>
                    {appt.prescriptionGivenAt && (
                      <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                        Issued: {new Date(appt.prescriptionGivenAt).toLocaleString()}
                      </p>
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
              <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusColor[appt.status]}`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;