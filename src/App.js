import React from 'react';
import Navigator from '~/screens/Navigator'

import {UserContextProvider} from '~/Context/User';

const App = () => {
  
  return(
    <UserContextProvider>
      <Navigator />
    </UserContextProvider>
  )
}


export default App