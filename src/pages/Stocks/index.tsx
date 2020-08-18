import React, { useState, FormEvent } from 'react';

import Header from '../../components/Header';
import Input from '../../components/Input';
import Select from '../../components/Select';

import api from '../../services/api';
import { PolishedIntradayDailyAndWeekly, PolishedSearch } from '../../services/api-types';

import searchIcon from '../../assets/search.svg';
import './styles.css';
import StockBySymbol from '../../components/StockBySymbol';

const Stocks: React.FC = () => {
  const [type, setType] = useState('name');
  const [search, setSearch] = useState('');
  const [series, setSeries] = useState('intraday');
  const [intervalTime, setIntervalTime] = useState('5min');
  const [outputSize, setOutputSize] = useState('compact');

  const [total, setTotal] = useState(0);
  const [resultsByName, setResultsByName] = useState<PolishedSearch>([]);
  const [resultsBySymbol, setResultsBySymbol] = useState<PolishedIntradayDailyAndWeekly>();
  const [isResultsEmpty, setIsResultsEmpty] = useState({ byName: false, bySymbol: false });

  async function searchByName(name: string) {
    try {
      const results = await api.get<PolishedSearch>(`/search/${name}`);

      setTotal(results.headers['x-total-count']);
      setResultsByName(results.data);

      if(results.data.length < 1) {
        setIsResultsEmpty({...isResultsEmpty, byName: true})
      } else {
        setIsResultsEmpty({...isResultsEmpty, byName: false})
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  async function searchBySymbol(symbol: string) {
    try {
      const results = await api.get<PolishedIntradayDailyAndWeekly>(`/prices/${series}/${symbol}`, {
        params: {
          interval: intervalTime,
          outputsize: outputSize
        }
      });

      console.log(results.data)

      setResultsBySymbol(results.data);

      if(results.data.error) {
        setIsResultsEmpty({...isResultsEmpty, bySymbol: true})
      } else {
        setIsResultsEmpty({...isResultsEmpty, bySymbol: false})
      }
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
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
      searchBySymbol(search)
    }

    localStorage.setItem('last', `${Date.now()}`);
  }

  function waitTwoMinutes() {
    const twoMinutes = 120000;
    const twoMinutesWaited =
      Date.now() > Number(localStorage.getItem('last')) + twoMinutes;

    return twoMinutesWaited
  }

  return (
    <>
      <Header name="stocks" activePage="Stocks" hasFavorites />
      <div id="stocks">
        <form onSubmit={handleSearchStocks}>
          <div role="group" aria-labelledby="legend">
            <div id="legend">O que deseja ?</div>

            <Select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { label: "Pesquisar pelo nome", value: "name" },
                { label: "Pesquisar pelo símbolo", value: "symbol" }
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
          {type === "name" ? resultsByName.map(result => (
            <div key={result.symbol}>
              <div>{result.symbol}</div>
              <div>{total}</div>
            </div>
          )) : (
            <p key={resultsBySymbol?.data?.symbol}>{resultsBySymbol?.timeSeries?.a?.close}</p>
          )}

          {(type === "name" && isResultsEmpty.byName) ? (
            <p>Nenhum resultado encontrado</p>
          ) : (type === "symbol" && isResultsEmpty.bySymbol) ? (
            <p>Nenhum resultado encontrado</p>
          ) : null }
        </main>
      </div>
    </>
  );
};

export default Stocks;
