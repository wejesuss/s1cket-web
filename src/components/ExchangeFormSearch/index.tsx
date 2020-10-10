import React, { FormEvent } from 'react';

import Input from '../Input';
import DataList from '../DataList';

import { waitTwoMinutes } from '../../helpers';
import { useExchangeRate } from '../../hooks/useExchangeRate';

import searchIcon from '../../assets/search.svg';
import './styles.css';

const ExchangeFormSearch: React.FC = () => {
  const {
    form: { from, to },
    updateExchangeRate,
    updateForm,
  } = useExchangeRate();

  function handleSearchExchange(e: FormEvent) {
    e.preventDefault();

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    updateExchangeRate(from, to);
  }

  return (
    <form onSubmit={handleSearchExchange}>
      <div role="group" aria-labelledby="legend" className="symbol">
        <div id="legend">Quer fazer uma troca?</div>

        <Input
          label="Da moeda"
          upLabel="up"
          name="from_currency"
          spellCheck="false"
          autoComplete="off"
          list="currencies-list"
          onChange={(e) => updateForm({ from: e.target.value })}
          value={from}
        />

        <Input
          label="Para a moeda"
          upLabel="up"
          name="to_currency"
          spellCheck="false"
          autoComplete="off"
          list="currencies-list"
          onChange={(e) => updateForm({ to: e.target.value })}
          value={to}
        />

        <button type="submit">
          <img src={searchIcon} alt="Pesquisar" />
        </button>

        <DataList unified />
      </div>
    </form>
  );
};

export default ExchangeFormSearch;
