import React from 'react';
import { Provider } from 'urql';
import client from './client';
import Customers from './Customers';

const Home = () => (
  <Customers />
);

const App = () => (
  <Provider value={client}>
    <Home />
  </Provider>
);

export default App;
