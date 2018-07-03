import React from 'react';

const FormLabel = ({ label }) => {
  return (
    <span style={{ paddingRight: 8, width: 100, lineHeight: '32px', textAlign: 'right' }}>
      <span style={{ paddingRight: 4, color: 'red', fontFamily: 'SimSun' }}>*</span>
      {label}:
    </span>
  );
};

export default FormLabel;
