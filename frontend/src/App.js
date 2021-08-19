import React from 'react';
import './App.css';

import Header from 'components/Header'
import DataPanel from 'components/DataPanel';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';


const createApolloClient = () => {
  const hostname = process.env.DOCKER_API ? process.env.DOCKER_API : "localhost:8010"
  return new ApolloClient({
    link: new HttpLink({
      uri: `http://flask:5000/proxy/graphql`,
      headers: {}
    }),
    cache: new InMemoryCache(),
  });
};

export default function App() {
  const client = createApolloClient();
  return (
    <ApolloProvider client={client}>
        <Header />
        <DataPanel />
    </ApolloProvider>
  );
}
