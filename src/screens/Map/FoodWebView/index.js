import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';
import Loading from '~/Components/Loading'

const FoodWebView = ({route}) => {
    return(
        <SafeAreaView style={{flex: 1}}>
            <WebView
                source={{ uri: route.params.url }}
            />
        </SafeAreaView>
    )
}

export default FoodWebView