/* eslint-disable camelcase */
import React, { FormEvent, useState, useEffect } from 'react';

import Input from '../Input';

import { waitTwoMinutes } from '../../helpers';
import { digital, physical } from '../../services/currencies.json';

import { ExchangeFormSearchProps } from '../../@types';

import searchIcon from '../../assets/search.svg';
import './styles.css';

const ExchangeFormSearch: React.FC<ExchangeFormSearchProps> = ({
  setFromCurrency,
  setToCurrency,
  from_currency,
  to_currency,
  searchExchangeRate,
}) => {
  const [currencies, setCurrencies] = useState(physical);

  function handleSearchExchange(e: FormEvent) {
    e.preventDefault();

    if (!waitTwoMinutes()) {
      alert('Espere dois minutos para pesquisar de novo');
      return;
    }

    searchExchangeRate(from_currency, to_currency);
  }

  useEffect(() => {
    const newCurrencies = physical.concat(
      digital.map((currency) => {
        return {
          ...currency,
          code: String(currency.code),
        };
      }),
    );

    setCurrencies(newCurrencies);
  }, []);

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
          onChange={(e) => setFromCurrency(e.target.value)}
          value={from_currency}
        />

        <Input
          label="Para a moeda"
          upLabel="up"
          name="to_currency"
          spellCheck="false"
          autoComplete="off"
          list="currencies-list"
          onChange={(e) => setToCurrency(e.target.value)}
          value={to_currency}
        />

        <button type="submit">
          <img src={searchIcon} alt="Pesquisar" />
        </button>

        <datalist id="currencies-list">
          {currencies.map((currency) => (
            <option value={currency.code} key={currency.code}>
              {currency.name}
            </option>
          ))}
        </datalist>
      </div>
    </form>
  );
};

export default ExchangeFormSearch;
