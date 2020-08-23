import React from 'react';

import Heart from '../Heart';

import './styles.css';

interface ArticleProps {
  symbol: string;
  currency: string;
  name: string;
  region: string;
  type: string;
  seriesActionIntraday: Function;
  seriesActionDaily: Function;
  seriesActionWeekly: Function;
}

const Article: React.FC<ArticleProps> = (
  { symbol,
    currency,
    name,
    region,
    type,
    seriesActionIntraday,
    seriesActionDaily,
    seriesActionWeekly
  }) => {

  return (
    <article>
      <header>
        <Heart
          currency={currency}
          name={name}
          region={region}
          symbol={symbol}
          type={type}
        />
        <h1>
          {name} <sup>{symbol}</sup>
        </h1>
        <div className="info">
          <div className="row">
            <h5>Tipo</h5>
            <h6>
              {type}
              <sup>{currency}</sup>
            </h6>
          </div>

          <div className="row">
            <h5>Região</h5>
            <h6>{region}</h6>
          </div>

          <div className="row prices">
            <h5>Preços: </h5>
          </div>
        </div>
      </header>

      <footer>
        <button
          onClick={() => seriesActionIntraday()}
        >
          Intraday
        </button>
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
      </footer>
    </article>
  );
};

export default Article;
