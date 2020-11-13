import React from 'react'
import Weather from './Weather'

import database from '@react-native-firebase/database'

import Styled from 'styled-components/native'


const Container = Styled.SafeAreaView`
    flex: 1;
    background-color: #EEE;
`;



class HomeScreen extends React.Component{

  
  
  componentDidMount(){
    
    const reference = database().ref('/season/winter')
    reference.once("value").then(snapshot => {
      console.log(snapshot.val());
    })
    
  }

  render(){
    return(
      <Container>
        <Weather/>
        {/* <ImageList/>
        <Season/>
        <ImageList/> */}
      </Container>
    )
  }
}

export default HomeScreen
