import React, { createContext, useState } from 'react';
import { ExchangeRateData, ExchangeRateForm } from '../@types';
import api from '../services/api';

import { PolishedExchangeRate } from '../services/api-types';

const ExchangeRate = createContext({} as ExchangeRateData);

const ExchangeRateProvider: React.FC = ({ children }) => {
  const [exchangeRate, setExchangeRate] = useState<PolishedExchangeRate>();
  const [from, setFrom] = useState('BTC');
  const [to, setTo] = useState('USD');
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  function updateForm({ from: fromC, to: toC }: Partial<ExchangeRateForm>) {
    if (fromC !== undefined && fromC !== null) {
      setFrom(fromC);
    }

    if (toC !== undefined && toC !== null) {
      setTo(toC);
    }
  }

  async function updateExchangeRate(fromC: string, toC: string) {
    if (!fromC || !toC) {
      return;
    }

    try {
      const results = await api.get<PolishedExchangeRate>(
        '/currencies/exchange',
        {
          params: {
            from_currency: fromC,
            to_currency: toC,
          },
        },
      );

      setExchangeRate(results.data);

      if (results.data.error) {
        setIsResultsEmpty(true);
      } else {
        localStorage.setItem('last', `${Date.now()}`);
        setIsResultsEmpty(false);
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  return (
    <ExchangeRate.Provider
      value={{
        form: { from, to },
        exchangeRate,
        isResultsEmpty,
        updateForm,
        updateExchangeRate,
      }}
    >
      {children}
    </ExchangeRate.Provider>
  );
};

export { ExchangeRate, ExchangeRateProvider };
