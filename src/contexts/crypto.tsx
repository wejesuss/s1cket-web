import React, { createContext, useState } from 'react';

import api from '../services/api';
import { PolishedCryptoSeries as CryptoSeries } from '../services/api-types';

interface CryptoForm {
  series: string;
  market: string;
  search: string;
}

export interface CryptoData {
  resultsBySymbol?: CryptoSeries;
  code: string;
  form: CryptoForm;
  isResultsEmpty: boolean;
  updateForm({ market, search, series }: Partial<CryptoForm>): void;
  searchBySymbol(
    symbol: string,
    incomingSeries: string,
    incomingMarket: string,
  ): Promise<void>;
}

const CryptoContext = createContext({} as CryptoData);

const CryptoProvider: React.FC = ({ children }) => {
  const [search, setSearch] = useState('BTC');
  const [market, setMarket] = useState('USD');
  const [series, setSeries] = useState('daily');
  const [resultsBySymbol, setResultsBySymbol] = useState<CryptoSeries>();
  const [code, setCode] = useState('USD');
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  async function searchBySymbol(
    symbol: string,
    incomingSeries: string,
    incomingMarket: string,
  ) {
    if (!symbol || !incomingSeries || !incomingMarket) {
      return;
    }

    try {
      const results = await api.get<CryptoSeries>(
        `/currencies/prices/${incomingSeries}/${symbol}`,
        {
          params: {
            market: incomingMarket,
          },
        },
      );

      setCode(results.data.data?.marketCode.toUpperCase() || 'USD');
      setResultsBySymbol(results.data);

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

  function updateForm({
    market: incomingMarket,
    search: incomingSearch,
    series: incomingSeries,
  }: Partial<CryptoForm>) {
    if (incomingMarket !== undefined && incomingMarket !== null) {
      setMarket(incomingMarket);
    }

    if (incomingSeries) {
      setSeries(incomingSeries);
    }

    if (incomingSearch !== undefined && incomingSearch !== null) {
      setSearch(incomingSearch);
    }
  }

  return (
    <CryptoContext.Provider
      value={{
        code,
        form: { market, search, series },
        isResultsEmpty,
        resultsBySymbol,
        updateForm,
        searchBySymbol,
      }}
    >
      {children}
    </CryptoContext.Provider>
  );
};

export { CryptoContext, CryptoProvider };
