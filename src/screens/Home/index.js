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
  color: white;
  font-size: 16px;
`;
const API_KEY = "6b3df92331ad3dd3d5e970ffe1382aa5"

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
        //https://api.openweathermap.org/data/2.5/weather?lat=37.507390607185336&lon=126.87669615985372&appid=6b3df92331ad3dd3d5e970ffe1382aa5&units=metric
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
        .then(response => response.json())
        .then(json => {
          setData({
                isLoaded: true,
                icon: json.weather[0].icon,
                weather: getWeatherText(json.weather[0].icon),
                season: getSeason()
            });
        })
        .catch(error => {
          setData({
                isLoaded: false
          });
          console.log(error);
          showError('날씨 정보를 가져오는데에 실패');
        });
      },
      error => {
        console.log(error)
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
      let day = new Date().getDate();     
      switch (month) {
          case 12: if(day===25)return "크리스마스"
          case 1: if(day===1)return "새해"
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
            return "ERROR"
      }
  };

  useEffect(()=>{
    SplashScreen.hide();
    setCurrentWeather();
    initRandomMainFood();
  },[]);

  
  return(
    <Container>
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
          <MainFoodText>추천 메뉴 : {mainFood.name}</MainFoodText>
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
            <WeatherLabel>#현재 날씨 : {data.weather}</WeatherLabel>
              <Image
                  source={{uri: `http://openweathermap.org/img/wn/${data.icon}@2x.png`}}
                  style={{width: 40, height: 40, marginLeft: 10}}
                />
          </View>
          <FoodImageList catagori="Weather" tag={data.weather} isLoaded={data.isLoaded}/>
        </CatagoriContainer>
        :
        <LoadingView>
            <Loading size="small" color="#1976D2" />
            <LoadingLabel>날씨 정보 얻는 중...</LoadingLabel>
        </LoadingView>
      }
      <CatagoriContainer>
        <WeatherLabel>#{data.season}</WeatherLabel>
        <FoodImageList catagori="Anniversary" tag={data.season}  isLoaded={data.isLoaded}/>
      </CatagoriContainer>
    </Container>
  )
}

export default Home
