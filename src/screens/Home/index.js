import React, { useEffect, useContext,} from 'react'
import {Image, Text, View} from 'react-native'
import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'


import {StateContext} from '~/Context/State'


const Container = Styled.SafeAreaView`
  justify-content: center;
  align-items: center;
  flexDirection: row;
  background-color: blue;
`;
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

const Home = () => {
  const {weatherInfo} = useContext(StateContext);

  useEffect( ()=> {
    SplashScreen.hide();
  },[])

  
  return(
    <Container>
            {weatherInfo.isLoaded ?
              <View>
                <WeatherLabel>인기 음식 메뉴</WeatherLabel>
                <WeatherItemContainer>
                  <WeatherLabel>현재 날씨 : {weatherInfo.weather}</WeatherLabel>
                  <Image
                    source={{uri: `http://openweathermap.org/img/wn/${weatherInfo.icon}@2x.png`}}
                    style={{width: 24, height: 24, marginLeft: 10}}
                  />
                </WeatherItemContainer>
              </View> : 
              <LoadingView>
                  <Loading size="large" color="#1976D2" />
                  <LoadingLabel>Loading...</LoadingLabel>
              </LoadingView>
            }
    </Container>
  )
}

export default Home
