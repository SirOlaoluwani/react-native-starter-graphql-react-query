import {QueryCache, QueryClient} from 'react-query';
import NetInfo from '@react-native-community/netinfo';
import {onlineManager} from 'react-query';

onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    console.log('network state', state);
    setOnline(state.isConnected as boolean | undefined);
  });
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.log('queryCache onError', error);
      //TODO: Handle Errors
    },
  }),
});

export default queryClient;
