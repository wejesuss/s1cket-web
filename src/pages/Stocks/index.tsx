import React, { useState, FormEvent } from 'react';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';
import StockBySymbol from '../../components/StockBySymbol';

import api from '../../services/api';
import {
  PolishedIntradayDailyAndWeekly,
  PolishedSearch,
} from '../../services/api-types';

import searchIcon from '../../assets/search.svg';
import './styles.css';
import Chart from '../../components/Chart';

const Stocks: React.FC = () => {
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [series, setSeries] = useState('intraday');
  const [intervalTime, setIntervalTime] = useState('5min');
  const [outputSize, setOutputSize] = useState('compact');
  const [resultsByName, setResultsByName] = useState<PolishedSearch>([]);
  const [resultsBySymbol, setResultsBySymbol] = useState<PolishedIntradayDailyAndWeekly>();
  const [isResultsEmpty, setIsResultsEmpty] = useState({ byName: false, bySymbol: false });

  async function searchByName(name: string) {
    try {
      const results = await api.get<PolishedSearch>(`/search/${name}`);

      setResultsByName(results.data);

      if (results.data.length < 1) {
        setIsResultsEmpty({ ...isResultsEmpty, byName: true });
      } else {
        setIsResultsEmpty({ ...isResultsEmpty, byName: false });
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  async function searchBySymbol(symbol: string, series: string, interval: string, outputsize: string) {
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

      console.log(results.data);

      setResultsBySymbol(results.data);

      if (results.data.error) {
        setIsResultsEmpty({ ...isResultsEmpty, bySymbol: true });
      } else {
        setIsResultsEmpty({ ...isResultsEmpty, bySymbol: false });
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function waitTwoMinutes() {
    const twoMinutes = 120000;
    const twoMinutesWaited =
      Date.now() > Number(localStorage.getItem('last')) + twoMinutes;

    return twoMinutesWaited;
  }

  function handleSearchStocks(e: FormEvent) {
    e.preventDefault();

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    if (type === 'name') {
      searchByName(search);
    } else {
      searchBySymbol(search, series, intervalTime, outputSize);
    }

    localStorage.setItem('last', `${Date.now()}`);
  }

  function handleSearchStocksBySeries(series: string, symbol: string) {
    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    setSearch(symbol)
    setSeries(series)
    searchBySymbol(symbol, series, intervalTime, outputSize);
    setType("symbol")

    localStorage.setItem('last', `${Date.now()}`);
  }

  return (
    <>
      <Header name="stocks" activePage="Stocks" hasFavorites />
      <div id="stocks">
        <form onSubmit={handleSearchStocks}>
          <div
            role="group"
            aria-labelledby="legend"
            className={type === 'symbol' ? 'symbol' : ''}
          >
            <div id="legend">O que deseja ?</div>

            <Select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { label: 'Pesquisar pelo nome', value: 'name' },
                { label: 'Pesquisar pelo símbolo', value: 'symbol' },
              ]}
            />

            {type === 'symbol' && (
              <StockBySymbol
                series={series}
                intervalTime={intervalTime}
                outputSize={outputSize}
                setSeries={setSeries}
                setIntervalTime={setIntervalTime}
                setOutputSize={setOutputSize}
              />
            )}

            <Input
              label={
                type === 'name'
                  ? 'Nome da empresa/fundo'
                  : 'Símbolo da empresa/fundo'
              }
              upLabel={search ? 'up' : ''}
              name="search"
              spellCheck="false"
              autoComplete="off"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />

            <button type="submit">
              <img src={searchIcon} alt="Pesquisar" />
            </button>
          </div>
        </form>
        <main>
          {type === 'name' ? (
            resultsByName.length > 0 && (
              <>
                <h1 className="results-title">
                  Estes são os resultados da sua busca
                </h1>
                <div className="results">
                  {resultsByName.map((result) => (
                    <article key={result.symbol}>
                      <header>
                        <h1>
                          {result.name} <sup>{result.symbol}</sup>
                        </h1>
                        <div className="info">
                          <div className="row">
                            <h5>Tipo</h5>
                            <h6>
                              {result.type}
                              <sup>{result.currency}</sup>
                            </h6>
                          </div>

                          <div className="row">
                            <h5>Região</h5>
                            <h6>{result.region}</h6>
                          </div>

                          <div className="row prices">
                            <h5>Preços: </h5>
                          </div>
                        </div>
                      </header>

                      <footer>
                        <button onClick={() => handleSearchStocksBySeries("intraday", result.symbol)}>Intraday</button>
                        <button onClick={() => handleSearchStocksBySeries("daily", result.symbol)}>Daily</button>
                        <button onClick={() => handleSearchStocksBySeries("weekly", result.symbol)}>Weekly</button>
                      </footer>
                    </article>
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
                      <Chart series={resultsBySymbol.timeSeries} height={200} type="candlestick" />
                      <Chart series={resultsBySymbol.timeSeries} type="bar" height={200} />
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
