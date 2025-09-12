import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [loginMessage, setLoginMessage] = useState('');

  const requireAuth = (action: () => void, message?: string, redirectTo: string = '/login') => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setLoginMessage(message || 'You need to be logged in to perform this action');
      setShowLoginModal(true);
    }
  };

  const requireAuthAsync = async (action: () => Promise<void>, message?: string, redirectTo: string = '/login') => {
    if (isAuthenticated) {
      await action();
    } else {
      setPendingAction(() => async () => await action());
      setLoginMessage(message || 'You need to be logged in to perform this action');
      setShowLoginModal(true);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  const handleModalClose = () => {
    setShowLoginModal(false);
    setPendingAction(null);
    setLoginMessage('');
  };

  return { 
    requireAuth, 
    requireAuthAsync, 
    isAuthenticated,
    showLoginModal,
    loginMessage,
    handleLoginRedirect,
    handleModalClose
  };
};
