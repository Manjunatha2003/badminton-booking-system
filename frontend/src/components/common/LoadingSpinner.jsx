import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ 
        width: '24px', 
        height: '24px', 
        border: '3px solid rgba(255,255,255,0.3)', 
        borderTop: '3px solid white', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }}></div>
      <span style={{ marginLeft: '8px' }}>Processing...</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;