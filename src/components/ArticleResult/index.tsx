import React from 'react';

import api from '../../services/api';
import { PolishedIntradayDailyAndWeekly } from '../../services/api-types';
import { waitTwoMinutes } from '../../Helpers';
import StockArticle from '../StockArticle';
import { StocksArticleProps } from '../../@types';

const ArticleResult: React.FC<StocksArticleProps> = (
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
