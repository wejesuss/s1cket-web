import React, { FormEvent } from 'react';

import Input from '../Input';
import Select from '../Select';
import StockBySymbol from '../StockBySymbol';

import { waitTwoMinutes } from '../../helpers';
import { useStocks } from '../../hooks/useStocks';

import searchIcon from '../../assets/search.svg';
import './styles.css';

const StocksFormSearch: React.FC = () => {
  const {
    form: { intervalTime, outputSize, search, series, type },
    searchByName,
    searchBySymbol,
    updateForm,
  } = useStocks();

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
          onChange={(e) => updateForm({ type: e.target.value })}
          options={[
            { label: 'Pesquisar pelo nome', value: 'name' },
            { label: 'Pesquisar pelo símbolo', value: 'symbol' },
          ]}
        />

        {type === 'symbol' && <StockBySymbol />}

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
          onChange={(e) => updateForm({ search: e.target.value })}
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
