import React from 'react';
import { WebView } from 'react-native-webview';

const FoodWebView = ({route}) => {
    return(
        <WebView
            source={{uri: route.params.url}}
            style={{flex:1}}
      />
    )
}

export default FoodWebView