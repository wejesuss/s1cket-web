import React from 'react';

import Header from '../../components/Header';
import ExchangeFormSearch from '../../components/ExchangeFormSearch';
import ExchangeArticle from '../../components/ExchangeArticle';

import { useExchangeRate } from '../../hooks/useExchangeRate';

import './styles.css';

const Exchange: React.FC = () => {
  const { exchangeRate, isResultsEmpty } = useExchangeRate();

  return (
    <>
      <Header name="exchange" activePage="Exchange" hasFavorites />

      <div id="exchange">
        <ExchangeFormSearch />

        <main>
          {exchangeRate?.currencyExchangeRate && (
            <ExchangeArticle
              fromCurrencyCode={
                exchangeRate.currencyExchangeRate.fromCurrencyCode
              }
              fromCurrencyName={
                exchangeRate.currencyExchangeRate.fromCurrencyName
              }
              toCurrencyCode={exchangeRate.currencyExchangeRate.toCurrencyCode}
              toCurrencyName={exchangeRate.currencyExchangeRate.toCurrencyName}
              exchangeRate={exchangeRate.currencyExchangeRate.exchangeRate}
              bidPrice={exchangeRate.currencyExchangeRate.bidPrice}
              askPrice={exchangeRate.currencyExchangeRate.askPrice}
            />
          )}

          {isResultsEmpty ? (
            <p className="no-results">Nenhum resultado encontrado</p>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default Exchange;
