import React from 'react';
import {Text, View} from 'react-native';

import WarningIcon from 'src/assets/images/icons/warning.svg';

// import * as Sentry from '@sentry/react';

export default class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false, errorInfo: null, error: null};
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    //TODO: uncomment this when Sentry is installed
    // Sentry.captureException(error);

    this.setState({
      errorInfo,
      error,
    });
  }

  render() {
    if (this.state.errorInfo) {
      // You can render any custom fallback UI
      return (
        <View
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 16,
            backgroundColor: '#ffffff',
            height: '100%',
          }}>
          <View
            style={{
              width: '100%',
              marginBottom: 16,
            }}>
            <WarningIcon width={100} height={100} />
          </View>
          <Text
            style={[
              {
                fontSize: 24,
                fontWeight: '600',
                lineHeight: 28,
                color: '#062F4D',
              },
              {color: '#059AE5'},
            ]}>
            An error occured
          </Text>
          <Text
            style={[
              {
                fontSize: 18,
                fontWeight: '600',
                lineHeight: 24,
                color: '#062F4D',
              },
              {marginBottom: 20},
            ]}>
            Please restart the app.
          </Text>
          <Text
            style={[
              {
                fontSize: 14,
                lineHeight: 24,
                color: '#011E33',
              },
            ]}>
            If this crash persists please contact the eBanqo support. Thanks
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
