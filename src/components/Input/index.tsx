import React, { InputHTMLAttributes } from 'react';

import './styles.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  upLabel: string;
  label: string;
}

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
