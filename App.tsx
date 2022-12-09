import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import Index from './app/Index';

import {ApolloClient, ApolloProvider, InMemoryCache, gql, createHttpLink} from '@apollo/client';
import {api_url} from './app/config';
import { ApolloLink } from 'apollo-boost'
import { onError } from 'apollo-link-error'

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message))
})

const httpLink = createHttpLink({
  uri: api_url,
});


const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const client = new ApolloClient({
    // uri: api_url,
    cache: new InMemoryCache(),
    link: httpLink
  });

  client.query({
    query: gql`
      query test {
        test
      }
    `
  }).then((res) => {
    console.log("root res : " ,res)
  }).catch((err) => console.log("Root er", err))

  return (
    <SafeAreaView style={backgroundStyle}>
      <ApolloProvider client={client}>
        <Index />
      </ApolloProvider>
    </SafeAreaView>
  );
};

export default App;
