/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

// Third-party Libraries
import * as Sentry from '@sentry/react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ApolloProvider} from '@apollo/client';
import {NavigationContainer} from '@react-navigation/native';

//Components
import ErrorBoundary from '../../components/ErrorBoundary';

//Services
import client from 'src/services/graphql-store';
import {QueryClientProvider} from 'react-query';
import queryClient from 'src/services/react-query-config';

import {REACT_APP_BASE_URL} from '@env';
import apiResource from 'src/services/api';
import {useEffect} from 'react';

const environment = process.env.NODE_ENV;
console.log(environment);
console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);

const App = () => {
  const fetchData = async () => {
    try {
      const reasponse = await apiResource().get(REACT_APP_BASE_URL);
      console.log('response', reasponse);
    } catch (error) {
      console.log('error', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <View style={styles.container}>
                <Text>Cheers to building a wonderful app.</Text>
              </View>
            </NavigationContainer>
          </QueryClientProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
