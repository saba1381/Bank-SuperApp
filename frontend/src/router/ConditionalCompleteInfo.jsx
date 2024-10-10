import React from 'react';
import { Navigate } from 'react-router-dom';
import CompleteInfo from '../features/private/CompleteInfo';

const ConditionalCompleteInfo = () => {
  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  if (!isNewUser) {
    return <Navigate to="/cp" />; 
  }

  return <CompleteInfo />;
};

export default ConditionalCompleteInfo;
