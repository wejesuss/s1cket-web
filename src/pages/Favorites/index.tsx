import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

import Header from '../../components/Header';
import StockArticle from '../../components/StockArticle';
import CryptoArticle from '../../components/CryptoArticle';
import ExchangeArticle from '../../components/ExchangeArticle';

import { getFavoriteQueryParam, waitTwoMinutes } from '../../Helpers';
import api from '../../services/api';
import { PolishedExchangeRate } from '../../services/api-types';

import './styles.css';

interface Search {
  id: string;
  symbol: string;
  type: string;
  name: string;
  currency: string;
  region: string;
};

interface Crypto {
  id: string;
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
};

interface ExchangeRate {
  id: string;
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
};

type Searches = Search[];
type Cryptos = Crypto[];
type ExchangeRates = ExchangeRate[];
type Favorites = Searches | Cryptos | ExchangeRates;

const Favorites: React.FC = () => {
  const history = useHistory();
  const [params, setParams] = useState(history.location.search);
  const [favorites, setFavorites] = useState<Favorites>([]);
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  useEffect(() => {
    const param = getFavoriteQueryParam(params);

    let favorites: Favorites = JSON.parse(localStorage.getItem(`favorites-${param}`) || '[]');
    if(favorites.length < 1) {
      setIsResultsEmpty(true)
    } else {
      setFavorites(favorites);
      setIsResultsEmpty(false);
    }

    setParams(param);
    // eslint-disable-next-line
  }, []);

  async function updateExchangeRate(id: string, from_currency: string, to_currency: string) {
    if(!waitTwoMinutes()) {
      return;
    }

    try {
      const { data } = await api.get<PolishedExchangeRate>(
        "/currencies/exchange",
        {
          params: {
            from_currency,
            to_currency
          },
        },
      );

      const newFavorites = (favorites as ExchangeRates).map((oldFavorite) => {
        if(oldFavorite.id === id) {
          return {
            ...oldFavorite,
            askPrice: data.currencyExchangeRate?.askPrice || "-",
            bidPrice: data.currencyExchangeRate?.bidPrice || "-",
            exchangeRate: data.currencyExchangeRate?.exchangeRate || "-"
          }
        }

        return oldFavorite;
      });

      localStorage.setItem('last', `${Date.now()}`);
      setFavorites(newFavorites);
      setIsResultsEmpty(false);
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function seriesAction(series: string, symbol: string, market?: string) {
    history.push(`/${params}`, { symbol, series, market })
  }

  return (
    <>
      <Header name="favorites" activePage="Favorites" />
      <div id="favorites">
        <main>
          {favorites.length > 0 && (
            <>
              <h1 className="results-title">
                Estes são os seus Favoritos
              </h1>
              <div className="results">
                {params === "stocks" && (favorites as Searches).map((result) => (
                  <StockArticle
                    key={result.id}
                    type={result.type}
                    name={result.name}
                    currency={result.currency}
                    region={result.region}
                    symbol={result.symbol}
                    seriesActionIntraday={() => seriesAction("intraday", result.symbol)}
                    seriesActionDaily={() => seriesAction("daily", result.symbol)}
                    seriesActionWeekly={() => seriesAction("weekly", result.symbol)}
                  />
                ))}

                {params === "crypto" && (favorites as Cryptos).map(result => (
                  <CryptoArticle
                    key={result.id}
                    symbol={result.symbol}
                    name={result.name}
                    currency={result.currency}
                    currencyName={result.currencyName}
                    seriesActionDaily={() => seriesAction("daily", result.symbol, result.currency)}
                    seriesActionWeekly={() => seriesAction("weekly", result.symbol, result.currency)}
                    seriesActionMonthly={() => seriesAction("monthly", result.symbol, result.currency)}
                  />
                ))}

                {params === "exchange" && (favorites as ExchangeRates).map(result => (
                  <ExchangeArticle
                    key={result.id}
                    fromCurrencyCode={result.fromCurrencyCode}
                    fromCurrencyName={result.fromCurrencyName}
                    toCurrencyCode={result.toCurrencyCode}
                    toCurrencyName={result.toCurrencyName}
                    exchangeRate={result.exchangeRate}
                    bidPrice={result.bidPrice}
                    askPrice={result.askPrice}
                    updateExchangeRate={
                      () => updateExchangeRate(result.id, result.fromCurrencyCode, result.toCurrencyCode)
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
