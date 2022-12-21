import React from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Dashboard, Home, Scan} from './app/screens';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  gql,
  createHttpLink,
  split,
  from,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import {api_url} from './app/config';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {onError} from 'apollo-link-error';
import {createClient} from 'graphql-ws';
import {getMainDefinition} from '@apollo/client/utilities';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

const errorLink: any = onError(
  ({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
      console.log('[Graphql Errors] : ', graphQLErrors);
    }

    // To retry on network errors, we recommend the RetryLink
    // instead of the onError link. This just logs the error.
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);

const httpLink = new HttpLink({
  uri: api_url,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://192.168.43.152:8000/graphql',
  }),
);

const authLink = new ApolloLink((operation, forward) => {
  // const token = getToken()
  // if (token) {
  //   operation.setContext({
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  // }
  return forward(operation);
});

const Stack = createNativeStackNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const link: any = errorLink.concat(authLink.concat(httpLink));
  const client = new ApolloClient({
    // uri: api_url,
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink, wsLink]),
    // link,
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
          <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              headerBackVisible: false,
              // headerRight: () => (
              //   <View>
              //     <Icon.Button
              //       name="qr-code-scanner"
              //       color={'black'}
              //       iconStyle={{fontSize: 40}}
              //       style={{
              //         alignItems: 'center',
              //         justifyContent: 'center',
              //       }}
              //       onPress={() => {
              //         console.log('Pressed');
              //         // props.navigation.navigate('Scan');
              //       }}
              //       backgroundColor="#ffffff"></Icon.Button>
              //   </View>
              // ),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
