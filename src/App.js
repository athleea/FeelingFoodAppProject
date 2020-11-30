import React from 'react';

import Navigator from '~/screens/Navigator'

import {StateContextProvider} from '~/Context/State';

import {StatusBar} from 'react-native';


const onPress = () => {
  console.log("HelloWorld");
}
class App extends React.Component{
  

  render(){
    return(
      <StateContextProvider>
        <StatusBar barStyle="default" />
        <Navigator />
      </StateContextProvider>
      
    )
  }

  
}


export default App