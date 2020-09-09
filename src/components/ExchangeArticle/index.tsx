import React from 'react';

import Heart from '../Heart';

import './styles.css';

interface ArticleProps {
  fromCurrencyCode: string;
  fromCurrencyName: string;
  toCurrencyCode: string;
  toCurrencyName: string;
  exchangeRate: string;
  bidPrice: string;
  askPrice: string;
  updateExchangeRate?: Function;
};

const ExchangeArticle: React.FC<ArticleProps> = (
  { fromCurrencyCode,
    fromCurrencyName,
    toCurrencyCode,
    toCurrencyName,
    exchangeRate,
    bidPrice,
    askPrice,
    updateExchangeRate
  })=> {

  return (
    <article className="exchange">
      <header>
        {updateExchangeRate && (
          <span className="reload">
            <svg
              onClick={() => updateExchangeRate()}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M4.98314 11.0001C5.4959 10.9915 5.92502 11.3704 5.99117 11.8666L5.99986 11.9831L6.00349 12.2069C6.11245 15.4322 8.76324 18 12 18C12.187 18 12.3727 17.9915 12.5567 17.9746L12.2929 17.7071C11.9024 17.3166 11.9024 16.6834 12.2929 16.2929C12.6834 15.9024 13.3166 15.9024 13.7071 16.2929L15.7071 18.2929C16.0976 18.6834 16.0976 19.3166 15.7071 19.7071L13.7071 21.7071C13.3166 22.0976 12.6834 22.0976 12.2929 21.7071C11.9024 21.3166 11.9024 20.6834 12.2929 20.2929L12.6112 19.977C12.4086 19.9923 12.2048 20 12 20C7.7687 20 4.28886 16.7094 4.01667 12.5105L4.0042 12.2575L4.00015 12.0169C3.99083 11.4647 4.43093 11.0095 4.98314 11.0001ZM11.7071 2.29289C12.0676 2.65338 12.0953 3.22061 11.7903 3.6129L11.7071 3.70711L11.3892 4.02302C11.5916 4.00771 11.7953 4 12 4C16.4183 4 20 7.58172 20 12C20 12.5523 19.5523 13 19 13C18.4477 13 18 12.5523 18 12C18 8.68629 15.3137 6 12 6C11.8129 6 11.6271 6.00853 11.443 6.02545L11.7071 6.29289C12.0976 6.68342 12.0976 7.31658 11.7071 7.70711C11.3466 8.06759 10.7794 8.09532 10.3871 7.7903L10.2929 7.70711L8.2929 5.70711C7.93241 5.34662 7.90468 4.77939 8.20971 4.3871L8.2929 4.29289L10.2929 2.29289C10.6834 1.90237 11.3166 1.90237 11.7071 2.29289Z" fill="#8950D2"/>
            </svg>
          </span>
        )}
        <Heart
          action="exchange"
          exchangeData={{
            id: (fromCurrencyCode + toCurrencyCode).toUpperCase(),
            fromCurrencyCode,
            fromCurrencyName,
            toCurrencyCode,
            toCurrencyName,
            exchangeRate,
            bidPrice,
            askPrice
          }}
        />
        <h1>
          {fromCurrencyName}
          <sup>{fromCurrencyCode}</sup>
        </h1>
        <div className="info">
          <div className="row">
            <h5>Para: </h5>
            <h6>{toCurrencyName}/{toCurrencyCode}</h6>
          </div>

          <div className="row">
            <h5>Taxa de câmbio: </h5>
            <h6>
              {exchangeRate !== '-' ? Number(exchangeRate).toFixed(2) : '--'}
            </h6>
          </div>

          <div className="row">
            <h5>Preço de venda: </h5>
            <h6>
              {askPrice !== '-' ? Number(askPrice).toFixed(2) : '--'}
            </h6>
          </div>
          <div className="row">
            <h5>Preço de compra: </h5>
            <h6>
              {bidPrice !== '-' ? Number(bidPrice).toFixed(2) : '--'}
            </h6>
          </div>
        </div>
      </header>
    </article>
  );
};

export default ExchangeArticle;
