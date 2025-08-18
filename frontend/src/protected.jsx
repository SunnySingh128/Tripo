import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authorized, setAuthorized] = useState(null); // null = loading

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Stored token:', token);

    if (token) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
      navigate('/signup');
    }
  }, [isAuthenticated, navigate]);

  if (authorized === null) return <p>Checking OTP...</p>;
  return authorized ? children : null;
};

export default ProtectedRoute;
