import React from 'react';

const AlertBanner = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const icons = {
    error: '⚠️',
    success: '🎉',
    warning: '🕵️',
    info: '💡'
  };

  return (
    <div className={`alert-banner alert-${type}`}>
      <span className="alert-icon">{icons[type] || '📌'}</span>
      <div className="alert-content">{message}</div>
      {onClose && (
        <button onClick={onClose} className="alert-close" aria-label="Close">
          &times;
        </button>
      )}
    </div>
  );
};

export default AlertBanner;
