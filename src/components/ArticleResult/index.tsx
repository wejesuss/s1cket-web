import React from 'react';

import StockArticle from '../StockArticle';

import { waitTwoMinutes } from '../../helpers';
import { StocksArticleProps } from '../../@types';
import { useStocks } from '../../hooks/useStocks';

const ArticleResult: React.FC<StocksArticleProps> = ({
  symbol,
  currency,
  name,
  region,
  type,
}) => {
  const {
    form: { intervalTime, outputSize },
    searchBySymbol,
    updateForm,
  } = useStocks();

  function handleSearchStocksBySeries(series: string, incomingSymbol: string) {
    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    updateForm({ series, search: incomingSymbol, type: 'symbol' });
    searchBySymbol(incomingSymbol, series, intervalTime, outputSize);

    localStorage.setItem('last', `${Date.now()}`);
  }

  return (
    <StockArticle
      type={type}
      currency={currency}
      name={name}
      region={region}
      symbol={symbol}
      seriesActionIntraday={() =>
        handleSearchStocksBySeries('intraday', symbol)
      }
      seriesActionDaily={() => handleSearchStocksBySeries('daily', symbol)}
      seriesActionWeekly={() => handleSearchStocksBySeries('weekly', symbol)}
    />
  );
};

export default ArticleResult;
