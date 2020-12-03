import React, { useEffect, useState} from 'react'
import {Dimensions, Image, View, Button, Alert} from 'react-native'
import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'

import FoodImageList from './FoodImageList'

import database from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor : lightyellow;
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
const CatagoriContainer = Styled.View`
  flex:1;
  backgroundColor: black;
  justify-content: flex-start;
  align-items: flex-start;
  
`;

const WeatherLabel = Styled.Text`
  padding: 5px;
  color: white;
  font-size: 20px;
  font-weight: bold;
`;
const LoadingView = Styled.View`
  flexDirection: row;
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
const API_KEY = ""

const Home = ({navigation}) => {
  
  const [mainFood, setMainFood] = useState([]);
  const [data, setData] = useState({})

  const initRandomMainFood = () =>{
    let index = Math.floor(Math.random() * 88)
    database().ref(`/Food/${index}`).once('value', snapshot => {
      setMainFood(snapshot.val());
    });
  }
  const requestLocationPermission = async() => {
        try{
          data.granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "위치 서비스 활성화",
                message:
                    "앱을 사용하기 위해 위치 서비스가 필요합니다" +
                    "위치 설정을 수정 하시겠습니까?",
                buttonNeutral: "Ask Me Later",
                buttonNegative: "취소",
                buttonPositive: "설정"
            }
          );
          if (data.granted === PermissionsAndroid.RESULTS.GRANTED) {
            setData({
                  isLoaded: false
              });
          } else {
            setData({
                  isLoaded: false
              });
          }
        } catch (err) {
            console.warn(err);
        }
  }; 
  const setCurrentWeather = async() => {
    await requestLocationPermission();
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(json => {
          setData({
                isLoaded: true,
                icon: json.weather[0].icon,
                weather: getWeatherText(json.weather[0].icon)
            });
        })
        .catch(error => {
          setData({
                isLoaded: false
            });
            console.log(error);
            showError('날씨 정보를 가져오는데에 실패')
        });
      },
      error => {
        setData({
          isLoaded: false
        });
        showError('위치 정보를 가져오는데에 실패');
      }
    );
  };
  const showError = (message) => {
      setTimeout( () => {
          Alert.alert(message);
      }, 500);
  };
  const getWeatherText = (icon) => {

      switch(icon) {
          case "01d":
          case "01n": return "맑음"
          case "50d":
          case "50n":
          case "02d":
          case "02n": 
          case "03d":
          case "03n": return "구름많음"
          case "04d":
          case "04n": return "흐림"
          case "09d":
          case "09n": return "소나기"
          case "10d":
          case "10n": return "비"
          case "11d":
          case "11n": return "천둥번개"
          case "13d":
          case "13n": return "눈"
          default:
              return "";
      }
  };
  const getSeason = () => {
      let month = new Date().getMonth() + 1;
      switch (month) {
          case 12:
          case 1:
          case 2: return "겨울"
          case 3:
          case 4:
          case 5: return "봄"
          case 6:
          case 7:
          case 8: return "여름"
          case 9:
          case 10:
          case 11: return "가을"

          default:
              return "알 수 없음"
      }
  };

  useEffect(()=>{
    setCurrentWeather();
    setData({season: getSeason()});
    initRandomMainFood();
    SplashScreen.hide();
  },[]);

  
  return(
    <Container>
      <Button 
        title={"press"}
        onPress={()=>{
          console.log(userInfo)
        }}
        />
       <MainFoodContainer>
         <MainFoodImage
            style={{
              borderRadius: 10,
              resizeMode: 'contain',
              width: (Dimensions.get('window').width) - 10,
              height: 200
            }}
          source={{uri: mainFood.url}}/>
        <MainFoodView>
          <MainFoodText>오늘의 추천 메뉴 : {mainFood.name}</MainFoodText>
          <RecommendButtonConatiner
            onPress={()=>{navigation.navigate('Recommend')}}
          >
            <RecommendButton>다른 메뉴 추천</RecommendButton>
          </RecommendButtonConatiner>
        </MainFoodView>
      </MainFoodContainer>
      {data.isLoaded ? 
        <CatagoriContainer>
          <View style={{flexDirection: 'row'}}>
            <WeatherLabel>현재 날씨 : {data.weather}</WeatherLabel>
              <Image
                  source={{uri: `http://openweathermap.org/img/wn/${data.icon}@2x.png`}}
                  style={{width: 24, height: 24, marginLeft: 10}}
                />
          </View>
          <FoodImageList catagori="Weather" tag={data.weather}/>
        </CatagoriContainer>
        :
        <LoadingView>
            <Loading size="small" color="#1976D2" />
            <LoadingLabel>날씨 정보 얻는 중...</LoadingLabel>
        </LoadingView>
      }
      

      
    </Container>
  )
}

export default Home
