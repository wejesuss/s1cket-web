/* eslint-disable react/jsx-indent */
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { waitTwoMinutes } from '../../helpers';
import { useStocks } from '../../hooks/useStocks';

import Header from '../../components/Header';
import Chart from '../../components/Chart';
import StockFormSearch from '../../components/StockFormSearch';
import ArticleResult from '../../components/ArticleResult';

import './styles.css';

const Stocks: React.FC = () => {
  const history = useHistory();
  const {
    byName,
    bySymbol,
    isResultsEmpty,
    form: { intervalTime, outputSize, search, series, type },
    updateForm,
    searchBySymbol,
  } = useStocks();

  function searchWithFavorites(
    incomingSeries?: string,
    incomingSymbol?: string,
  ) {
    const seriesToSearch = incomingSeries || series;
    const symbolToSearch = incomingSymbol || search;

    updateForm({
      type: 'symbol',
      series: symbolToSearch,
      intervalTime: '5min',
      search: symbolToSearch,
    });

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    searchBySymbol(symbolToSearch, seriesToSearch, intervalTime, outputSize);
  }

  useEffect(() => {
    const { state } = history.location;

    if (state) {
      const { series: incomingSeries, symbol: incomingSymbol } = state as {
        series?: string;
        symbol?: string;
      };
      searchWithFavorites(incomingSeries, incomingSymbol);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header name="stocks" activePage="Stocks" hasFavorites />

      <div id="stocks">
        <StockFormSearch />
        <main>
          {type === 'name'
            ? byName.length > 0 && (
                <>
                  <h1 className="results-title">
                    Estes são os resultados da sua busca
                  </h1>

                  <div className="results">
                    {byName.map((result) => (
                      <ArticleResult
                        key={result.symbol}
                        type={result.type}
                        currency={result.currency}
                        symbol={result.symbol}
                        name={result.name}
                        region={result.region}
                      />
                    ))}
                  </div>

                  <p className="results-end">Parece que chegamos ao fim!</p>
                </>
              )
            : bySymbol?.data?.symbol && (
                <>
                  <h1 className="results-title">
                    Informações sobre
                    {'  '}
                    {bySymbol?.data?.symbol.toUpperCase()}
                  </h1>

                  <div className="information">
                    <table>
                      <caption>{bySymbol.data.information}</caption>
                      <tbody>
                        <tr>
                          <th>Última Atualização:</th>
                          <td>{bySymbol.data.lastRefreshed}</td>
                        </tr>

                        {bySymbol.data.interval && (
                          <tr>
                            <th>Intervalo:</th>
                            <td>{bySymbol.data.interval}</td>
                          </tr>
                        )}

                        {bySymbol.data.outputSize && (
                          <tr>
                            <th>Tipo de Saída:</th>
                            <td>{bySymbol.data.outputSize}</td>
                          </tr>
                        )}

                        <tr>
                          <th>Fuso Horário:</th>
                          <td>{bySymbol.data.timeZone}</td>
                        </tr>
                      </tbody>
                    </table>

                    {bySymbol && (
                      <div className="chart">
                        <Chart
                          stockSeries={bySymbol.timeSeries}
                          height={200}
                          type="candlestick"
                        />
                        <Chart
                          stockSeries={bySymbol.timeSeries}
                          type="bar"
                          height={200}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

          {type === 'name' && isResultsEmpty.byName ? (
            <p className="no-results">Nenhum resultado encontrado</p>
          ) : type === 'symbol' && isResultsEmpty.bySymbol ? (
            <p className="no-results">Nenhum resultado encontrado</p>
          ) : null}
        </main>
      </div>
    </>
  );
};

export default Stocks;
