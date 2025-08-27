import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface UseAuthActionReturn {
  trigger: () => void;
  AuthModalComponent: () => JSX.Element | null;
}

export const useAuthAction = (callback: () => void): UseAuthActionReturn => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const trigger = () => {
    if (!user) {
      setShowModal(true);
    } else {
      callback();
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const AuthModalComponent = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-80 text-center">
          <h2 className="text-lg font-semibold mb-4">Login Required</h2>
          <p className="mb-4">Please log in to continue.</p>
          <button
            onClick={handleLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  };

  return { trigger, AuthModalComponent };
};
