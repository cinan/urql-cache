import React, { useState, useEffect } from 'react';
import { Provider, useSubscription, useQuery, gql } from 'urql';
import client from './client';
import Nodes from './Nodes';
import Add from './Add';

const Home = () => (
  <div>
    <Nodes />
    <Add />
  </div>
);

const App = () => (
  <Provider value={client}>
    <Home />
  </Provider>
);

export default App;
