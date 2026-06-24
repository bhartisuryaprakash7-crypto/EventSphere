import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    // Agar login nahi hai toh login page par bhejo
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Agar role authorized nahi hai toh unauthorized page ya dashboard par bhejo
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;