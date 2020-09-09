import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';

import Header from '../../components/Header';
import StockArticle from '../../components/StockArticle';
import CryptoArticle from '../../components/CryptoArticle';

import { PolishedSearch } from '../../services/api-types';

import './styles.css';

interface PolishedCrypto {
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
};

const Favorites: React.FC = () => {
  const history = useHistory()
  const urlparams = useLocation().search;
  const [params, setParams] = useState(urlparams)
  const [favorites, setFavorites] = useState<PolishedSearch | PolishedCrypto[]>([]);
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  useEffect(() => {
    const param = getFavoriteQueryParam(params);

    const favorites: PolishedSearch | PolishedCrypto[] = JSON.parse(localStorage.getItem(`favorites-${param}`) || '[]');
    if(favorites.length < 1) {
      setIsResultsEmpty(true)
    } else {
      setFavorites(favorites)
      setIsResultsEmpty(false)
    }
  // eslint-disable-next-line
  }, []);

  function seriesAction(series: string, symbol: string, market?: string) {
    history.push(`/${params}`, { symbol, series, market })
  }

  return (
    <>
      <Header name="favorites" activePage="Favorites" />
      <div id="favorites" className={params}>
        <main>
          {favorites.length > 0 && (
            <>
              <h1 className="results-title">
                Estes são os seus Favoritos
              </h1>
              <div className="results">
                {params === "stocks" ? (
                  (favorites as PolishedSearch).map((result) => (
                    <StockArticle
                      key={result.symbol}
                      type={result.type}
                      name={result.name}
                      currency={result.currency}
                      region={result.region}
                      symbol={result.symbol}
                      seriesActionIntraday={() => seriesAction("intraday", result.symbol)}
                      seriesActionDaily={() => seriesAction("daily", result.symbol)}
                      seriesActionWeekly={() => seriesAction("weekly", result.symbol)}
                    />
                  ))
                ) : (
                  (favorites as PolishedCrypto[]).map(result => (
                    <CryptoArticle
                      key={result.symbol + result.currency}
                      symbol={result.symbol}
                      name={result.name}
                      currency={result.currency}
                      currencyName={result.currencyName}
                      seriesActionDaily={() => seriesAction("daily", result.symbol, result.currency)}
                      seriesActionWeekly={() => seriesAction("weekly", result.symbol, result.currency)}
                      seriesActionMonthly={() => seriesAction("monthly", result.symbol, result.currency)}
                    />
                  ))
                )}
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
