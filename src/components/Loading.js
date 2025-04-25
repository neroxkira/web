import React from 'react';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="container">
        <div className="device"></div>
        <div className="device"></div>
        <div className="device"></div>
      </div>
    </div>
  );
};

export default Loading;
