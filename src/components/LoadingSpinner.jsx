import React from 'react';

const LoadingSpinner = ({ message = 'Examining evidence...' }) => {
  return (
    <div className="spinner-container">
      <div className="detective-spinner">
        <div className="lens"></div>
        <div className="handle"></div>
      </div>
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
