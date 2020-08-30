import React, { FC } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './pages/Home';
import Stocks from './pages/Stocks';
import Favorites from './pages/Favorites';
import Crypto from './pages/Crypto';

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <Route exact path="/">
        <Home />
      </Route>

      <Route path="/stocks">
        <Stocks />
      </Route>

      <Route path="/crypto">
        <Crypto />
      </Route>

      <Route path="/favorites">
        <Favorites />
      </Route>
    </BrowserRouter>
  );
};

export default Routes;
