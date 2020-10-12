import React, { createContext, useState } from 'react';
import api from '../services/api';

import {
  PolishedIntradayDailyAndWeekly as PolishedStocks,
  PolishedSearch,
} from '../services/api-types';

interface StocksForm {
  type: string;
  search: string;
  series: string;
  intervalTime: string;
  outputSize: string;
}

export interface StocksData {
  byName: PolishedSearch;
  bySymbol?: PolishedStocks;
  form: StocksForm;
  isResultsEmpty: {
    byName: boolean;
    bySymbol: boolean;
  };
  searchBySymbol(
    symbol: string,
    incomingSeries: string,
    interval: string,
    outputsize: string,
  ): Promise<void>;
  searchByName(name: string): Promise<void>;
  updateForm({
    intervalTime,
    outputSize,
    search,
    series,
    type,
  }: Partial<StocksForm>): void;
}

const StocksContext = createContext({} as StocksData);

const StocksProvider: React.FC = ({ children }) => {
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [series, setSeries] = useState('intraday');
  const [intervalTime, setIntervalTime] = useState('5min');
  const [outputSize, setOutputSize] = useState('compact');
  const [resultsByName, setResultsByName] = useState<PolishedSearch>([]);
  const [resultsBySymbol, setResultsBySymbol] = useState<PolishedStocks>();
  const [isResultsByNameEmpty, setIsResultsByNameEmpty] = useState(false);
  const [isResultsBySymbolEmpty, setIsResultsBySymbolEmpty] = useState(false);

  async function searchBySymbol(
    symbol: string,
    incomingSeries: string,
    interval: string,
    outputsize: string,
  ) {
    if (!symbol || !incomingSeries || !interval || !outputSize) {
      return;
    }

    try {
      const results = await api.get<PolishedStocks>(
        `/prices/${incomingSeries}/${symbol}`,
        {
          params: {
            interval,
            outputsize,
          },
        },
      );

      setResultsBySymbol(results.data);

      if (results.data.error) {
        setIsResultsBySymbolEmpty(true);
      } else {
        localStorage.setItem('last', `${Date.now()}`);
        setIsResultsBySymbolEmpty(false);
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  async function searchByName(name: string) {
    if (!name) {
      return;
    }

    try {
      const results = await api.get<PolishedSearch>(`/search/${name}`);

      setResultsByName(results.data);

      if (results.data.length < 1) {
        setIsResultsByNameEmpty(true);
      } else {
        localStorage.setItem('last', `${Date.now()}`);
        setIsResultsByNameEmpty(false);
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function updateForm({
    intervalTime: incomingInterval,
    outputSize: incomingOutputSize,
    search: incomingSearch,
    series: incomingSeries,
    type: incomingType,
  }: Partial<StocksForm>) {
    if (incomingType) {
      setType(incomingType);
    }

    if (incomingInterval) {
      setIntervalTime(incomingInterval);
    }

    if (incomingOutputSize) {
      setOutputSize(incomingOutputSize);
    }

    if (incomingSeries) {
      setSeries(incomingSeries);
    }

    if (incomingSearch !== undefined && incomingSearch !== null) {
      setSearch(incomingSearch);
    }
  }

  return (
    <StocksContext.Provider
      value={{
        byName: resultsByName,
        bySymbol: resultsBySymbol,
        form: { intervalTime, outputSize, search, series, type },
        isResultsEmpty: {
          byName: isResultsByNameEmpty,
          bySymbol: isResultsBySymbolEmpty,
        },
        searchBySymbol,
        searchByName,
        updateForm,
      }}
    >
      {children}
    </StocksContext.Provider>
  );
};

export { StocksContext, StocksProvider };
