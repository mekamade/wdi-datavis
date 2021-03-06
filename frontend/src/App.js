import React from 'react';
import Header from 'components/Header'
import DataPanel from 'components/DataPanel';
import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client';


const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: `http://localhost:5000/graphql`,
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
