import React, { FC } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <Route exact path="/">
        <h1>teste</h1>
      </Route>

      <Route path="/teste">
        <h1>Teste2</h1>
      </Route>
    </BrowserRouter>
  );
};

export default Routes;
