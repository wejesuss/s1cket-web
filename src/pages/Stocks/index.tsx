import React, { useState, FormEvent } from 'react';
import Header from '../../components/Header';

import searchIcon from '../../assets/search.svg';
import './styles.css';
import CustomArrow from '../../components/CustomArrow';
import api from '../../services/api';

const Stocks: React.FC = () => {
  const [type, setType] = useState('name');
  const [series, setSeries] = useState('intraday');
  const [intervalTime, setIntervalTime] = useState('5min');
  const [outputSize, setOutputSize] = useState('compact');
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [searchs, setSearchs] = useState([]);

  async function searchByName(name: string) {
    try {
      const results = await api.get(`/search/${name}`);

      setTotal(results.headers['x-total-count']);
      setSearchs(results.data);
    } catch (error) {
      console.error(error);
      alert('Erro inesperado, tente novamente em breve');
    }
  }

  function handleSearchStocks(e: FormEvent) {
    e.preventDefault();
    const twoMinutes = 120000;
    const twoMinutesWaited =
      Date.now() > Number(localStorage.getItem('last')) + twoMinutes;

    if (!twoMinutesWaited) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    if (type === 'name') {
      searchByName(search);
      localStorage.setItem('last', `${Date.now()}`);
    }
  }

  return (
    <>
      <Header name="stocks" activePage="Stocks" hasFavorites />
      <div id="stocks">
        <form onSubmit={handleSearchStocks}>
          <div role="group" aria-labelledby="legend">
            <div id="legend">O que deseja ?</div>

            <div className="select-block">
              <select
                name="type"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="name">Pesquisar pelo nome</option>
                <option value="symbol">Pesquisar pelo símbolo</option>
              </select>
              <span className="custom-arrow">
                <CustomArrow />
              </span>
            </div>

            {type === 'symbol' && (
              <>
                <div className="select-block">
                  <select
                    name="series"
                    id="series"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                  >
                    <option value="intraday">Intraday</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                  <span className="custom-arrow">
                    <CustomArrow />
                  </span>
                  <label htmlFor="series" className="up">
                    Série Temporal
                  </label>
                </div>

                <div className="select-block">
                  <select
                    name="interval"
                    id="interval"
                    value={intervalTime}
                    onChange={(e) => setIntervalTime(e.target.value)}
                  >
                    <option value="1min">1 Min</option>
                    <option value="5min">5 Min</option>
                    <option value="15min">15 Min</option>
                    <option value="30min">30 Min</option>
                    <option value="60min">60 Min</option>
                  </select>
                  <span className="custom-arrow">
                    <CustomArrow />
                  </span>
                  <label htmlFor="interval" className="up">
                    Intervalo
                  </label>
                </div>

                <div className="select-block">
                  <select
                    name="output"
                    id="output"
                    value={outputSize}
                    onChange={(e) => setOutputSize(e.target.value)}
                  >
                    <option value="compact">Compacto</option>
                    <option value="full">Completo</option>
                  </select>
                  <span className="custom-arrow">
                    <CustomArrow />
                  </span>
                  <label htmlFor="output" className="up">
                    Saída
                  </label>
                </div>
              </>
            )}

            <div className="input-block">
              <input
                type="text"
                id="search"
                name="search"
                spellCheck="false"
                autoComplete="off"
                onChange={(e) => setSearch(e.target.value)}
                value={search}
              />
              <label htmlFor="search" className={search ? 'up' : ''}>
                Nome da empresa/fundo
              </label>
            </div>

            <button type="submit">
              <img src={searchIcon} alt="Pesquisar" />
            </button>
          </div>
        </form>
        <main>
          {searchs.map(
            (searchItem: {
              symbol: string;
              currency: string;
              marketClose: string;
              marketOpen: string;
              matchScore: string;
              name: string;
              region: string;
              timezone: string;
              type: string;
            }) => (
              <div key={searchItem.symbol}>
                <div>{total}</div>
                <div>{searchItem.currency}</div>
                <div>{searchItem.marketClose}</div>
                <div>{searchItem.marketOpen}</div>
                <div>{searchItem.matchScore}</div>
                <div>{searchItem.name}</div>
                <div>{searchItem.region}</div>
                <div>{searchItem.symbol}</div>
                <div>{searchItem.timezone}</div>
                <div>{searchItem.type}</div>
              </div>
            ),
          )}
        </main>
      </div>
    </>
  );
};

export default Stocks;
