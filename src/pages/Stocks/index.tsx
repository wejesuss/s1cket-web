import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import Chart from '../../components/Chart';
import StockFormSearch from '../../components/StockFormSearch';
import ArticleResult from '../../components/ArticleResult';

import api from '../../services/api';
import {
  PolishedIntradayDailyAndWeekly,
  PolishedSearch,
} from '../../services/api-types';

import './styles.css';
import { waitTwoMinutes } from '../../Helpers';

const Stocks: React.FC = () => {
  const history = useHistory()
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [series, setSeries] = useState('intraday');
  const [intervalTime, setIntervalTime] = useState('5min');
  const [outputSize, setOutputSize] = useState('compact');
  const [resultsByName, setResultsByName] = useState<PolishedSearch>([]);
  const [resultsBySymbol, setResultsBySymbol] = useState<PolishedIntradayDailyAndWeekly>();
  const [isResultsEmpty, setIsResultsEmpty] = useState({ byName: false, bySymbol: false });

  async function searchBySymbol(symbol: string, series: string, interval: string, outputsize: string) {
    if(!symbol || !series || !interval || !outputSize) {
      return
    }
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

  useEffect(() => {
    const { state } = history.location;

    if(state) {
      const { series: incomingSeries, symbol: incomingSymbol } = state as { series?: string, symbol?: string };
      searchWithFavorites(incomingSeries, incomingSymbol)
    }
    // eslint-disable-next-line
  }, [])

  function searchWithFavorites(incomingSeries?: string, incomingSymbol?: string) {
    const seriesToSearch = incomingSeries || series
    const symbolToSearch = incomingSymbol || search
    setType(() => 'symbol')
    setSeries(() => seriesToSearch)
    setSearch(() => symbolToSearch)

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    searchBySymbol(symbolToSearch, seriesToSearch, intervalTime, outputSize);
  }

  return (
    <>
      <Header name="stocks" activePage="Stocks" hasFavorites />
      <div id="stocks">
        <StockFormSearch
          setType={setType}
          setSearch={setSearch}
          setSeries={setSeries}
          setIntervalTime={setIntervalTime}
          setOutputSize={setOutputSize}
          setIsResultsEmpty={setIsResultsEmpty}
          setResultsByName={setResultsByName}
          type={type}
          search={search}
          series={series}
          intervalTime={intervalTime}
          outputSize={outputSize}
          isResultsEmpty={isResultsEmpty}
          searchBySymbol={searchBySymbol}
        />
        <main>
          {type === 'name' ? (
            resultsByName.length > 0 && (
              <>
                <h1 className="results-title">
                  Estes são os resultados da sua busca
                </h1>
                <div className="results">
                  {resultsByName.map((result) => (
                    <ArticleResult
                      key={result.symbol}
                      setIsResultsEmpty={setIsResultsEmpty}
                      setResultsBySymbol={setResultsBySymbol}
                      setSearch={setSearch}
                      setSeries={setSeries}
                      setType={setType}
                      intervalTime={intervalTime}
                      isResultsEmpty={isResultsEmpty}
                      outputSize={outputSize}
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
          ) : (
            resultsBySymbol?.data?.symbol && (
              <>
                <h1 className="results-title">Informações sobre {resultsBySymbol?.data?.symbol.toUpperCase()}</h1>
                <div className="information">
                  <table>
                    <caption>{resultsBySymbol.data.information}</caption>
                    <tbody>
                      <tr>
                        <th>Última Atualização:</th>
                        <td>{resultsBySymbol.data.lastRefreshed}</td>
                      </tr>

                      {resultsBySymbol.data.interval && (
                        <tr>
                          <th>Intervalo:</th>
                          <td>{resultsBySymbol.data.interval}</td>
                        </tr>
                      )}

                      {resultsBySymbol.data.outputSize && (
                        <tr>
                          <th>Tipo de Saída:</th>
                          <td>{resultsBySymbol.data.outputSize}</td>
                        </tr>
                      )}

                      <tr>
                        <th>Fuso Horário:</th>
                        <td>{resultsBySymbol.data.timeZone}</td>
                      </tr>
                    </tbody>
                  </table>

                  {resultsBySymbol && (
                    <div className="chart">
                      <Chart stockSeries={resultsBySymbol.timeSeries} height={200} type="candlestick" />
                      <Chart stockSeries={resultsBySymbol.timeSeries} type="bar" height={200} />
                    </div>
                  )}
                </div>
              </>
            )
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
