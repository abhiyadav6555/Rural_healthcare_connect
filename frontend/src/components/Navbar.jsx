import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClass = "text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 hover:scale-105 transition-all inline-block";

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white px-6 py-4 flex justify-between items-center sticky top-0 z-40 transition-colors">
      <Link to="/" className="flex items-center gap-2 text-lg font-bold">
        <span className="text-2xl">🩺</span>
        <span>
          Rural<span className="text-orange-500 dark:text-orange-400">Health</span>Connect
        </span>
      </Link>

      <div className="flex gap-4 items-center text-sm">
        {!user && (
          <>
            <Link to="/login" className={linkClass}>Login</Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-orange-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 hover:scale-105 transition-transform inline-block"
            >
              Register Now
            </Link>
          </>
        )}

        {user && user.role === 'patient' && (
          <>
            <Link to="/patient-dashboard" className={linkClass}>Dashboard</Link>
            <Link to="/search-doctors" className={linkClass}>Find Doctors</Link>
          </>
        )}

        {user && user.role === 'doctor' && (
          <Link to="/doctor-dashboard" className={linkClass}>Dashboard</Link>
        )}

        {user && (
          <>
            <span className="text-gray-500 dark:text-slate-400 hidden sm:inline">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500/90 hover:bg-red-500 hover:scale-105 text-white px-3 py-1.5 rounded-lg text-sm transition-all"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;