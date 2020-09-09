import React, { useState } from 'react';

import Header from '../../components/Header';
import ExchangeFormSearch from '../../components/ExchangeFormSearch';
import ExchangeArticle from '../../components/ExchangeArticle';

import api from '../../services/api';
import { PolishedExchangeRate } from '../../services/api-types';

import './styles.css';

const Exchange: React.FC = () => {
  const [from_currency, setFromCurrency] = useState('BTC');
  const [to_currency, setToCurrency] = useState('USD');
  const [exchangeRate, setExchangeRate] = useState<PolishedExchangeRate>();
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  async function searchExchangeRate(from_currency: string, to_currency: string) {
    if(!from_currency || !to_currency) {
      return
    }

    try {
      const results = await api.get<PolishedExchangeRate>(
        "/currencies/exchange",
        {
          params: {
            from_currency,
            to_currency
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
    <>
      <Header name="exchange" activePage="Exchange" hasFavorites />
      <div id="exchange">
        <ExchangeFormSearch
          setFromCurrency={setFromCurrency}
          setToCurrency={setToCurrency}
          from_currency={from_currency}
          to_currency={to_currency}
          searchExchangeRate={searchExchangeRate}
        />
        <main>
          {exchangeRate?.currencyExchangeRate && (
            <ExchangeArticle
              fromCurrencyCode={exchangeRate.currencyExchangeRate.fromCurrencyCode}
              fromCurrencyName={exchangeRate.currencyExchangeRate.fromCurrencyName}
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
