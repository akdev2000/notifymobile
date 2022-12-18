import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Home, Scan} from './app/screens';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  createHttpLink,
  split,
} from '@apollo/client';
import {api_url} from './app/config';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {onError} from 'apollo-link-error';
import {createClient} from 'graphql-ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const errorLink = onError(({graphQLErrors, networkError}) => {
  if (graphQLErrors) graphQLErrors.map(({message}) => console.log(message));
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = createHttpLink({
  uri: api_url,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://192.168.43.152:8000/graphql',
  }),
);

const splitLink = split(
  ({query}) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const client = new ApolloClient({
    // uri: api_url,
    cache: new InMemoryCache(),
    link: httpLink.concat(wsLink),
  });

  // client.query({
  //   query: gql`
  //     query test {
  //       test
  //     }
  //   `
  // }).then((res) => {
  //   console.log("root res : " ,res)
  // }).catch((err) => console.log("Root er", err))

  return (
    <ApolloProvider client={client}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Scan" component={Scan} />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
