import React, { useState } from 'react';
import { DataListProps } from '../../@types';

import { digital, physical } from '../../services/currencies.json';

const newCurrencies = physical.concat(
  digital.map((currency) => {
    return {
      ...currency,
      code: String(currency.code),
    };
  }),
);

const DataList: React.FC<DataListProps> = ({ unified = false }) => {
  const [currencies] = useState(newCurrencies);

  return (
    <>
      {unified ? (
        <datalist id="currencies-list">
          {currencies.map((currency) => (
            <option value={currency.code} key={currency.code}>
              {currency.name}
            </option>
          ))}
        </datalist>
      ) : (
        <>
          <datalist id="digital-list">
            {digital.map((digitalC) => (
              <option value={String(digitalC.code)} key={digitalC.code}>
                {digitalC.name}
              </option>
            ))}
          </datalist>

          <datalist id="physical-list">
            {physical.map((physicalC) => (
              <option value={String(physicalC.code)} key={physicalC.code}>
                {physicalC.name}
              </option>
            ))}
          </datalist>
        </>
      )}
    </>
  );
};

export default React.memo(DataList);
