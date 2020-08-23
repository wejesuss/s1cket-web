import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';
import Article from '../../components/Article';

import { PolishedSearch } from '../../services/api-types';

import './styles.css';
import { useLocation, useHistory } from 'react-router';

const Favorites: React.FC = () => {
  const history = useHistory()
  const urlparams = useLocation().search;
  const [params, setParams] = useState(urlparams)
  const [favorites, setFavorites] = useState<PolishedSearch>([]);
  const [isResultsEmpty, setIsResultsEmpty] = useState(false);

  useEffect(() => {
    const arrayOfParams = params.slice(1).split("&");
    const index = arrayOfParams.findIndex(params => params.slice(0, 6) === "search");
    let param = 'stocks'
    if(index !== -1) {
      param = arrayOfParams[index].split("=")[1]
    }
    setParams(param)

    const favorites: PolishedSearch = JSON.parse(localStorage.getItem(`favorites-${param}`) || '[]')
    if(favorites.length < 1) {
      setIsResultsEmpty(true)
    } else {
      setFavorites(favorites)
      setIsResultsEmpty(false)
    }
  // eslint-disable-next-line
  }, []);

  function seriesAction(series: string, symbol: string) {
    history.push(`/${params}`, { symbol, series })
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
                {favorites.map((result) => (
                  <Article
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
