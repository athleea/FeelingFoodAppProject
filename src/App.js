import React from 'react';
import Navigator from '~/screens/Navigator'

import {UserContextProvider} from '~/Context/User';
import { StatusBar } from 'react-native';

const App = () => {
  
  return(
    <UserContextProvider>
      <StatusBar barStyle="light-content"/>
      <Navigator />
    </UserContextProvider>
  )
}


export default App