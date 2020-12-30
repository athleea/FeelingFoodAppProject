import React from 'react';
import Navigator from '~/screens/Navigator'

import {UserContextProvider} from '~/Context/User';
import { StatusBar } from 'react-native';


const App = () => {

  return(
    <UserContextProvider>
      <StatusBar barStyle="light-content" backgroundColor="#28292b"/>
      <Navigator />
    </UserContextProvider>
  )
}


export default App