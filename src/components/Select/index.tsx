import React from 'react';
import { SelectProps } from '../../@types';

import CustomArrow from '../CustomArrow';

import './styles.css';

const Select: React.FC<SelectProps> = ({ name, label, options, ...rest }) => {
  return (
    <div className="select-block">
      <select name={name} id={name} {...rest}>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="custom-arrow">
        <CustomArrow />
      </span>
      {label && (
        <label htmlFor={name} className="up">
          {label}
        </label>
      )}
    </div>
  );
};

export default Select;
