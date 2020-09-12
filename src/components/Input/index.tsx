import React from 'react';
import { InputProps } from '../../@types';

import './styles.css';

const Input: React.FC<InputProps> = ({ name, upLabel, label, ...rest }) => {
  return (
    <div className="input-block">
      <input id={name} name={name} type="text" {...rest} />
      <label htmlFor={name} className={upLabel ? 'up' : ''}>
        {label}
      </label>
    </div>
  );
};

export default Input;
