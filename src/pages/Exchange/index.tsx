import React, { useState } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';
import { PolishedExchangeRate } from '../../services/api-types';

import './styles.css';
import ExchangeFormSearch from '../../components/ExchangeFormSearch';

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
      <Header name="exchange" activePage="Exchange" />
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
            <article>
              <header>
                <h1>
                  {exchangeRate.currencyExchangeRate.fromCurrencyName}
                  <sup>{exchangeRate.currencyExchangeRate.fromCurrencyCode}</sup>
                </h1>
                <div className="info">
                  <div className="row">
                    <h5>Para: </h5>
                    <h6>
                      {exchangeRate.currencyExchangeRate.toCurrencyName}
                      /{exchangeRate.currencyExchangeRate.toCurrencyCode}
                    </h6>
                  </div>

                  <div className="row">
                    <h5>Preço de venda: </h5>
                    <h6>{exchangeRate.currencyExchangeRate.askPrice !== "-" ? Number(exchangeRate.currencyExchangeRate.askPrice).toFixed(2) : "--"}</h6>
                  </div>
                  <div className="row">
                    <h5>Preço de compra: </h5>
                    <h6>{exchangeRate.currencyExchangeRate.bidPrice !== "-" ? Number(exchangeRate.currencyExchangeRate.bidPrice).toFixed(2) : "--"}</h6>
                  </div>
                </div>
              </header>
            </article>
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
