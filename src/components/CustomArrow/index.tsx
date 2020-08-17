import React from 'react';

import './styles.css';

const CustomArrow: React.FC = () => {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="80.2%" x2="50.5%" y2="10" stroke="black" />
      <line x1="49.99%" y1="10" x2="100%" y2="80.2%" stroke="black" />
      <line x1="-0.2" y1="80%" x2="100.2%" y2="80%" stroke="black" />
    </svg>
  );
};

export default CustomArrow;
