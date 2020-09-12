import React from 'react';
import { StockArticleProps } from '../../@types';

import Heart from '../Heart';

import './styles.css';

const StockArticle: React.FC<StockArticleProps> = (
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
    <article className="stocks">
      <header>
        <Heart
          action="stocks"
          stocksData={{
            id: symbol.toUpperCase(),
            currency,
            name,
            region,
            symbol,
            type
          }}
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

export default StockArticle;
