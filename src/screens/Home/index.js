import React, { useEffect, useContext, useState,} from 'react'
import {Dimensions, Image, Text, View, Button} from 'react-native'
import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'

import {StateContext} from '~/Context/State'

import database from '@react-native-firebase/database';

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor : lightyellow;
`;

const MainFoodContainer = Styled.View`
  marginTop: 20px;
  justify-content: center;
  align-items: center;
`
const MainFoodLabelContainer = Styled.View`
  flexDirection: row;
  justify-content: center;
`
const MainFoodText = Styled.Text`
  flex: 3;
  text-align: center;
  marginTop : 15px;
  marginLeft: 10px;
  font-size: 20px
`
const RecommendButtonConatiner = Styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  marginTop : 15px;
  marginRight: 20px;
  backgroundColor: skyblue;  
`
const RecommendButton = Styled.Text`

`
const WeatherItemContainer = Styled.View`
  flexDirection: row;
  flex: 1;
  margin: 10px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const WeatherLabel = Styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
const LoadingView = Styled.View`
  margin: 10px;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Loading = Styled.ActivityIndicator`
  margin-bottom: 16px;
`;

const LoadingLabel = Styled.Text`
  font-size: 16px;
`;


const Home = ({navigation}) => {
  const {weatherInfo} = useContext(StateContext);
  const [foodList, setFoodList] = useState([]);

  let food = [];
  const getFoodList = () =>{
    database().ref(`/Food/`).once('value')
      .then(snapshot => {
        food = snapshot.val();
        let index = Math.floor(Math.random() * food.length)
        setFoodList(food[index]);
    });
  }

  useEffect( ()=> {
    SplashScreen.hide();
    getFoodList();
  },[])

  
  return(
    <Container>
      <MainFoodContainer>
        <Image
          style={{
            resizeMode: 'contain',
            width: (Dimensions.get('window').width) - 10,
            height: 200
          }}
          source={{uri: foodList.url}}/>
        <MainFoodLabelContainer>
          <MainFoodText>오늘의 추천 메뉴 : {foodList.name}</MainFoodText>
          <RecommendButtonConatiner
            onPress={()=>{navigation.navigate('Recommend')}}
          >
            <RecommendButton>다른 음식 메뉴</RecommendButton>
          </RecommendButtonConatiner>
        </MainFoodLabelContainer>
      </MainFoodContainer>
      {/* {weatherInfo.isLoaded ?
          
          <WeatherItemContainer>
              <WeatherLabel>현재 날씨 : {weatherInfo.weather}</WeatherLabel>
              <Image
                source={{uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}}
                style={{width: 24, height: 24, marginLeft: 10}}
              />
          </WeatherItemContainer>
         : 
        <Container>
          <LoadingView>
              <Loading size="large" color="#1976D2" />
              <LoadingLabel>Loading...</LoadingLabel>
          </LoadingView>
        </Container>
      } */}
    </Container>
  )
}

export default Home
