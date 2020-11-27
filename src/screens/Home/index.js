import React from 'react'
import Weather from './Weather'
import FoodImageList from './FoodImageList'

import database from '@react-native-firebase/database'

import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'


const Container = Styled.SafeAreaView`
    flex: 1;
    backgroundColor: skyblue;
`;




const Home = () => {

  constructor(props){
    super(props)
    this.state ={
      data: [],
    }
  }

  
  
  componentDidMount(){
    const reference = database().ref('/season/autumn')
    reference.once("value").then(snapshot => {
      console.log(snapshot.val());
      this.setState({data : snapshot.val()})
      console.log(this.state.data[0].name);
    })
    SplashScreen.hide();
  }

  render(){
    return(
      <Container>
        {/* <Weather/> */}
        <FoodImageList tagTitle="가을" foodList={this.state}/>
      </Container>
    )
  }
}

export default HomeScreen
