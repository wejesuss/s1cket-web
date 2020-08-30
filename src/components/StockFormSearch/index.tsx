import React, { FormEvent } from 'react';

import Input from '../Input';
import Select from '../Select';
import StockBySymbol from '../StockBySymbol';

import api from '../../services/api';
import { PolishedSearch } from '../../services/api-types';

import searchIcon from '../../assets/search.svg';
import { waitTwoMinutes } from '../../Helpers';
import './styles.css';

export interface IsResultsEmpty {
  byName: boolean;
  bySymbol: boolean;
}

interface StocksFormSearchProps {
  setType: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSeries: React.Dispatch<React.SetStateAction<string>>;
  setIntervalTime: React.Dispatch<React.SetStateAction<string>>;
  setOutputSize: React.Dispatch<React.SetStateAction<string>>;
  setResultsByName: React.Dispatch<React.SetStateAction<PolishedSearch>>;
  setIsResultsEmpty: React.Dispatch<React.SetStateAction<IsResultsEmpty>>;
  type: string;
  search: string;
  series: string;
  intervalTime: string;
  outputSize: string;
  isResultsEmpty: IsResultsEmpty;
  searchBySymbol: Function;
}

const StocksFormSearch: React.FC<StocksFormSearchProps> = (
  { setIntervalTime,
    setOutputSize,
    setSearch,
    setSeries,
    setType,
    setResultsByName,
    setIsResultsEmpty,
    type,
    search,
    series,
    intervalTime,
    outputSize,
    isResultsEmpty,
    searchBySymbol
  }) => {

  async function searchByName(name: string) {
    if(!name) {
      return
    }
    try {
      const results = await api.get<PolishedSearch>(`/search/${name}`);

      setResultsByName(results.data);

      if (results.data.length < 1) {
        setIsResultsEmpty({ ...isResultsEmpty, byName: true });
      } else {
        localStorage.setItem('last', `${Date.now()}`);
        setIsResultsEmpty({ ...isResultsEmpty, byName: false });
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
      searchBySymbol(search, series, intervalTime, outputSize);
    }
  }

  return (
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
  );
};

export default StocksFormSearch;
