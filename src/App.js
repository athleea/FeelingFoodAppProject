import React from 'react';
import Navigator from '~/screens/Navigator'

import SplashScreen from 'react-native-splash-screen';

class App extends React.Component{

  constructor(props){
    super(props);
    
  }

  render(){
    return(
      <Navigator />
    )
  }
  
  async componentDidMount(){
    
    SplashScreen.hide();
    
  }
  
}


export default App