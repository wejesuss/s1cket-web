import React, { FormEvent } from 'react';

import Input from '../Input';
import Select from '../Select';
import DataList from '../DataList';

import { waitTwoMinutes } from '../../helpers';

import { CryptoFormSearchProps } from '../../@types';

import searchIcon from '../../assets/search.svg';
import './styles.css';

const CryptoFormSearch: React.FC<CryptoFormSearchProps> = ({
  setSearch,
  setMarket,
  setSeries,
  search,
  market,
  series,
  searchBySymbol,
}) => {
  function handleSearchCrypto(e: FormEvent) {
    e.preventDefault();

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    searchBySymbol(search, series, market);
  }

  return (
    <form onSubmit={handleSearchCrypto}>
      <div role="group" aria-labelledby="legend" className="symbol">
        <div id="legend">O que deseja ?</div>

        <Select
          name="series"
          label="Série Temporal"
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          options={[
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
          ]}
        />

        <Input
          label="Mercado da criptomoeda"
          upLabel="up"
          name="market"
          spellCheck="false"
          autoComplete="off"
          list="physical-list"
          onChange={(e) => setMarket(e.target.value)}
          value={market}
        />

        <Input
          label="Símbolo da criptomoeda"
          upLabel="up"
          name="search"
          spellCheck="false"
          autoComplete="off"
          list="digital-list"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />

        <button type="submit">
          <img src={searchIcon} alt="Pesquisar" />
        </button>

        <DataList />
      </div>
    </form>
  );
};

export default CryptoFormSearch;
