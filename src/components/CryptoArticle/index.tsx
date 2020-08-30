import React from 'react';

import Heart from '../Heart';

import './styles.css';

interface ArticleProps {
  symbol: string;
  name: string;
  currency: string;
  currencyName: string;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
  seriesActionMonthly: Function;
}

const CryptoArticle: React.FC<ArticleProps> = (
  { symbol,
    name,
    currency,
    currencyName,
    seriesActionDaily,
    seriesActionWeekly,
    seriesActionMonthly
  }) => {

  return (
    <article>
      <header>
        <Heart
          action="crypto"
          symbol={symbol}
          currency={currency}
          currencyName={currencyName}
          name={name}
        />
        <h1>
          {name} <sup>{symbol}</sup>
        </h1>
        <div className="info">
          <div className="row">
            <h5>Mercado: </h5>
            <h6>{currencyName}/{currency}</h6>
          </div>

          <div className="row prices">
            <h5>Preços: </h5>
          </div>
        </div>
      </header>

      <footer>
        <button
          onClick={() => seriesActionDaily()}
        >
          Daily
        </button>
        <button
          onClick={() => seriesActionWeekly()}
        >
          Weekly
        </button>
        <button
          onClick={() => seriesActionMonthly()}
        >
          Monthly
        </button>
      </footer>
    </article>
  );
};

export default CryptoArticle;
