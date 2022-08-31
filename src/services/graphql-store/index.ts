import { Alert, Platform } from "react-native";
// third-party libraries
import {
  ApolloClient,
  HttpLink,
  ApolloLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import Config from "EbanqoCustomerServiceApp/config.env";

const httpLink = new HttpLink({
  uri: Config.API_GATEWAY,
  headers: {
    device: Platform.OS,
    version: DeviceInfo.getVersion(),
  },
});

const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 5,
    retryIf: (error, _operation) => !!error,
  },
});

// Authentication Middleware
const authMiddleware = new ApolloLink((operation, forward) => {
  //TODO: Handle Authentication

  return forward(operation);
});

const showGraphQLError = (description: string) => {
  Alert.alert("Ooops...", description);
};

const showNetworkError = (description: string) => {
  Alert.alert("Ooops...", `${description}. Please try again!`);
};

const authLink = concat(authMiddleware, httpLink);

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors && graphQLErrors.length) {
      /**
       * Loop throught the graphql error and handle error cases
       */
      graphQLErrors.forEach(async ({ message, extensions, ...errorParams }) => {
        switch (extensions?.code) {
          case "FORBIDDEN":
            // old token has expired throwing AuthenticationError,
            // one way to handle is to obtain a new token and
            // add it to the operation context

            //TODO: Get Updated Authentication Token and update appropriately
            const headers = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...headers,
                // token: TokenStorage.getToken(),
              },
            });

            // Now, pass the modified operation to the next link
            // in the chain. This effectively intercepts the old
            // failed request, and retries it with a new token
            return forward(operation);

          case "GRAPHQL_VALIDATION_FAILED":
            return forward(operation);
          default:
            showGraphQLError(message);
            return message;
        }
      });
    }

    if (networkError) {
      showNetworkError(networkError.message);
    }
  }
);

const link = ApolloLink.from([errorLink, authLink, retryLink]);

const client = new ApolloClient({
  cache: new InMemoryCache({
    addTypename: false,
    typePolicies: {
      Query: {
        fields: {},
      },
    },
  }),
  link,
  defaultOptions: { watchQuery: { fetchPolicy: "cache-and-network" } },
});

export default client;
