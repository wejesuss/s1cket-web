/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import StockArticle from '../../components/StockArticle';
import CryptoArticle from '../../components/CryptoArticle';
import ExchangeArticle from '../../components/ExchangeArticle';

import { getFavoriteQueryParam, waitTwoMinutes } from '../../helpers';
import api from '../../services/api';
import { PolishedExchangeRate } from '../../services/api-types';
import {
  CryptoProps,
  ExchangeProps,
  StocksProps,
  Favorites as IFavorites,
} from '../../@types';

import './styles.css';

const Favorites: React.FC = () => {
  const history = useHistory();
  const [param] = useState(getFavoriteQueryParam(history.location.search));
  const [favorites, setFavorites] = useState<IFavorites>([]);
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  useEffect(() => {
    const localFavorites: IFavorites = JSON.parse(
      localStorage.getItem(`favorites-${param}`) || '[]',
    );

    if (localFavorites.length < 1) {
      setIsResultsEmpty(true);
    } else {
      setFavorites(localFavorites);
    }
  }, [param]);

  async function updateExchangeRate(
    id: string,
    from_currency: string,
    to_currency: string,
  ) {
    if (!waitTwoMinutes()) {
      return;
    }

    try {
      const { data } = await api.get<PolishedExchangeRate>(
        '/currencies/exchange',
        {
          params: {
            from_currency,
            to_currency,
          },
        },
      );

      const newFavorites = (favorites as ExchangeProps[]).map((oldFavorite) => {
        if (oldFavorite.id === id) {
          return {
            ...oldFavorite,
            askPrice: data.currencyExchangeRate?.askPrice || '-',
            bidPrice: data.currencyExchangeRate?.bidPrice || '-',
            exchangeRate: data.currencyExchangeRate?.exchangeRate || '-',
          };
        }

        return oldFavorite;
      });

      localStorage.setItem('last', `${Date.now()}`);
      setFavorites(newFavorites);
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function seriesAction(series: string, symbol: string, market?: string) {
    history.push(`/${param}`, { symbol, series, market });
  }

  return (
    <>
      <Header name="favorites" activePage="Favorites" />

      <div id="favorites">
        <main>
          {favorites.length > 0 && (
            <>
              <h1 className="results-title">Estes são os seus Favoritos</h1>

              <div className="results">
                {param === 'stocks' &&
                  (favorites as StocksProps[]).map((result) => (
                    <StockArticle
                      key={result.id}
                      type={result.type}
                      name={result.name}
                      currency={result.currency}
                      region={result.region}
                      symbol={result.symbol}
                      seriesActionIntraday={() =>
                        seriesAction('intraday', result.symbol)
                      }
                      seriesActionDaily={() =>
                        seriesAction('daily', result.symbol)
                      }
                      seriesActionWeekly={() =>
                        seriesAction('weekly', result.symbol)
                      }
                    />
                  ))}

                {param === 'crypto' &&
                  (favorites as CryptoProps[]).map((result) => (
                    <CryptoArticle
                      key={result.id}
                      symbol={result.symbol}
                      name={result.name}
                      currency={result.currency}
                      currencyName={result.currencyName}
                      seriesActionDaily={() =>
                        seriesAction('daily', result.symbol, result.currency)
                      }
                      seriesActionWeekly={() =>
                        seriesAction('weekly', result.symbol, result.currency)
                      }
                      seriesActionMonthly={() =>
                        seriesAction('monthly', result.symbol, result.currency)
                      }
                    />
                  ))}

                {param === 'exchange' &&
                  (favorites as ExchangeProps[]).map((result) => (
                    <ExchangeArticle
                      key={result.id}
                      fromCurrencyCode={result.fromCurrencyCode}
                      fromCurrencyName={result.fromCurrencyName}
                      toCurrencyCode={result.toCurrencyCode}
                      toCurrencyName={result.toCurrencyName}
                      exchangeRate={result.exchangeRate}
                      bidPrice={result.bidPrice}
                      askPrice={result.askPrice}
                      updateExchangeRate={() =>
                        updateExchangeRate(
                          result.id,
                          result.fromCurrencyCode,
                          result.toCurrencyCode,
                        )
                      }
                    />
                  ))}
              </div>

              <p className="results-end">Parece que chegamos ao fim!</p>
            </>
          )}

          {isResultsEmpty ? (
            <p className="no-results">Nenhum favorito encontrado</p>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default Favorites;
