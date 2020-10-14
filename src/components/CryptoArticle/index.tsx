import React from 'react';
import { CryptoArticleProps } from '../../@types';

import Heart from '../Heart';

import './styles.css';

const CryptoArticle: React.FC<CryptoArticleProps> = ({
  symbol,
  name,
  currency,
  currencyName,
  seriesActionDaily,
  seriesActionWeekly,
  seriesActionMonthly,
}) => {
  return (
    <article className="crypto">
      <header>
        <Heart
          action="crypto"
          cryptoData={{
            id: (symbol + currency).toUpperCase(),
            symbol,
            currency,
            currencyName,
            name,
          }}
        />
        <h1>
          {name}
          <sup>{symbol}</sup>
        </h1>
        <div className="info">
          <div className="row">
            <h5>Mercado: </h5>
            <h6>
              {currencyName}
              <>/</>
              {currency}
            </h6>
          </div>

          <div className="row prices">
            <h5>Preços: </h5>
          </div>
        </div>
      </header>

      <footer>
        <button type="button" onClick={() => seriesActionDaily()}>
          Daily
        </button>
        <button type="button" onClick={() => seriesActionWeekly()}>
          Weekly
        </button>
        <button type="button" onClick={() => seriesActionMonthly()}>
          Monthly
        </button>
      </footer>
    </article>
  );
};

export default CryptoArticle;
