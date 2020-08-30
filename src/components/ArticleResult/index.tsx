import React from 'react';

import api from '../../services/api';
import { PolishedIntradayDailyAndWeekly } from '../../services/api-types';
import { IsResultsEmpty } from '../StockFormSearch';
import { waitTwoMinutes } from '../../Helpers';
import StockArticle from '../StockArticle';

interface ArticleProps {
  setResultsBySymbol: React.Dispatch<React.SetStateAction<PolishedIntradayDailyAndWeekly | undefined>>;
  setIsResultsEmpty: React.Dispatch<React.SetStateAction<IsResultsEmpty>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
  intervalTime: string;
  outputSize: string;
  isResultsEmpty: IsResultsEmpty;
}

const ArticleResult: React.FC<ArticleProps> = (
  { setIsResultsEmpty,
    setResultsBySymbol,
    setSearch,
    setSeries,
    setType,
    symbol,
    currency,
    name,
    region,
    type,
    intervalTime,
    outputSize,
    isResultsEmpty
  }) => {

  async function searchBySymbol(symbol: string, series: string, interval: string, outputsize: string) {
    try {
      const results = await api.get<PolishedIntradayDailyAndWeekly>(
        `/prices/${series}/${symbol}`,
        {
          params: {
            interval,
            outputsize,
          },
        },
      );

      setResultsBySymbol(results.data);

      if (results.data.error) {
        setIsResultsEmpty({ ...isResultsEmpty, bySymbol: true });
      } else {
        localStorage.setItem('last', `${Date.now()}`);
        setIsResultsEmpty({ ...isResultsEmpty, bySymbol: false });
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function handleSearchStocksBySeries(series: string, symbol: string) {
    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    setSearch(symbol)
    setSeries(series)
    searchBySymbol(symbol, series, intervalTime, outputSize);
    setType("symbol")

    localStorage.setItem('last', `${Date.now()}`);
  }

  return (
    <StockArticle
      type={type}
      currency={currency}
      name={name}
      region={region}
      symbol={symbol}
      seriesActionIntraday={() => handleSearchStocksBySeries("intraday", symbol)}
      seriesActionDaily={() => handleSearchStocksBySeries("daily", symbol)}
      seriesActionWeekly={() => handleSearchStocksBySeries("weekly", symbol)}
    />
  );
};

export default ArticleResult;
