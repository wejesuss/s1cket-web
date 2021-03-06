import React, { FC } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import Stocks from './pages/Stocks';
import Favorites from './pages/Favorites';
import Crypto from './pages/Crypto';
import Exchange from './pages/Exchange';

import { ExchangeRateProvider } from './contexts/exchangeRate';
import { StocksProvider } from './contexts/stocks';
import { CryptoProvider } from './contexts/crypto';

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <Route exact path="/">
        <Home />
      </Route>

      <ExchangeRateProvider>
        <Route path="/exchange">
          <Exchange />
        </Route>
      </ExchangeRateProvider>

      <StocksProvider>
        <Route path="/stocks">
          <Stocks />
        </Route>
      </StocksProvider>

      <CryptoProvider>
        <Route path="/crypto">
          <Crypto />
        </Route>
      </CryptoProvider>

      <Route path="/favorites">
        <Favorites />
      </Route>
    </BrowserRouter>
  );
};

export default Routes;
