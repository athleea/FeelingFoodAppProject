import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from '~/screens/Navigator'
import SplashScreen from 'react-native-splash-screen';

class App extends React.Component{
  render(){
    return(
      
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    )
  }

  async componentDidMount(){
    setTimeout( () => SplashScreen.hide(), 1000);
  }
}


export default App