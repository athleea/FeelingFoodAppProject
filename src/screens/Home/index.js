import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, Image, View, Button, Alert } from 'react-native'

import FoodImageList from './FoodImageList'
import LoadingView from '~/Components/Loading'
import { UserContext } from '../../Context/User';

import SplashScreen from 'react-native-splash-screen';
import database from '@react-native-firebase/database';
import Styled from 'styled-components/native'


const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor : black;
`;
const MainFoodContainer = Styled.View`
  margin: 20px 20px;
  justify-content: center;
  align-items: center;
`
const MainFoodImage = Styled.Image`
`
const MainFoodView = Styled.View`
  flexDirection: row;
  justify-content: center;
`
const MainFoodText = Styled.Text`
  color: white;
  flex: 5;
  text-align: center;
  marginTop : 15px;
  marginLeft: 10px;
  font-size: 18px;
  font-weight: bold;
`
const RecommendButtonConatiner = Styled.TouchableOpacity`
  flex: 2;
  justify-content: center;
  align-items: center;
  marginTop : 15px;
  marginRight: 20px;
  backgroundColor: skyblue;  
`
const RecommendButton = Styled.Text`

`
const CatagoriContainer = Styled.View`
  flex:1;
  justify-content: flex-start;
  align-items: flex-start;
  
`;

const WeatherLabel = Styled.Text`
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;



const Home = ({ navigation }) => {
  const { location, showError,isLoaded} = useContext(UserContext)
  
  const [mainFood, setMainFood] = useState([]);
  const [data, setData] = useState({})

  const {weather, icon, season} = location

  const initRandomMainFood = () => {
    let index = Math.floor(Math.random() * 88)
    database().ref(`/Food/${index}`).once('value', snapshot => {
      setMainFood(snapshot.val());
    });
  }
  


  useEffect(() => {
    initRandomMainFood();
    SplashScreen.hide();
    
  }, []);


  return (
    <Container>
      <MainFoodContainer>
        <MainFoodImage
          style={{
            borderRadius: 10,
            resizeMode: 'contain',
            width: (Dimensions.get('window').width) - 10,
            height: 200
          }}
          source={{ uri: mainFood.url }} />
        <MainFoodView>
          <MainFoodText>추천 메뉴 : {mainFood.name}</MainFoodText>
          <RecommendButtonConatiner
            onPress={() => { navigation.navigate('Recommend') }}
          >
            <RecommendButton>다른 메뉴 추천</RecommendButton>
          </RecommendButtonConatiner>
        </MainFoodView>
      </MainFoodContainer>

      {isLoaded ?
          <CatagoriContainer>
            <View style={{ flexDirection: 'row' }}>
              <WeatherLabel>#현재 날씨 : {weather}</WeatherLabel>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={{ width: 40, height: 40, marginLeft: 10 }}
              />
            </View>
            <FoodImageList catagori="Weather" tag={weather}/>
          </CatagoriContainer>
        :
          <LoadingView />
        }
        <WeatherLabel>#{season}</WeatherLabel>
        <FoodImageList catagori="Anniversary" tag={season} />
    </Container>
  )
}

export default Home