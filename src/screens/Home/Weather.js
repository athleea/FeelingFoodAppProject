import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';
import Styled from 'styled-components/native'

const Container = Styled.View`
    flexDirection: row;
`;
const WeatherItemContainer = Styled.View`
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

const API_KEY = "6b3df92331ad3dd3d5e970ffe1382aa5"



const Weather = (props) => {

    const [weatherInfo, setWeatherInfo] = useState({
        granted: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        isLoaded: false,
        weatherId: undefined,
        weather: ""
    });

    const requestLocationPermission = async() => {
        try{
            weatherInfo.granted = await PermissionsAndroid.request(
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
            if (weatherInfo.granted === PermissionsAndroid.RESULTS.GRANTED) {
                setWeatherInfo({
                    isLoaded: true
                });
            } else {
                setWeatherInfo({
                    isLoaded: false
                });
            }
        } catch (err) {
            console.warn(err);
        }
    };
    
    const getCurrentWeather = async() => {
        await requestLocationPermission();
        Geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(json => {
                    setWeatherInfo({
                        isLoaded: true,
                        weatherId: json.weather[0].id,
                        weather: setWeatherText(json.weather[0].id)
                    });
                })
                .catch(error => {
                    setWeatherInfo({
                        isLoaded: false
                    });
                    console.log(error);
                    showError('날씨 정보를 가져오는데에 실패')
                });
            },
            error => {
                setWeatherInfo({
                    isLoaded: false
                });
                showError('위치 정보를 가져오는데에 실패');
            }
        );
    };
    
    const setWeatherText = (id) => {
        
        switch(Math.floor(id / 100)) {
            case 2:
            case 3:
            case 5:
            case 9:
                return '비';
            case 6:
                return '눈';
            case 7:
                return '흐림'
            case 8:
                return '맑음'
            default:
                return undefined;
        }
    };
    const showError = (message) => {
        setTimeout( () => {
            Alert.alert(message);
        }, 500);
    };
    
    

    useEffect( () => {
        getCurrentWeather();
    }, []);


    return(
        <Container>
            {weatherInfo.isLoaded?
            <WeatherItemContainer>
                <WeatherLabel>인기 음식 메뉴 #{weatherInfo.weather}</WeatherLabel> 
            </WeatherItemContainer> : 
            <LoadingView>
                <Loading size="large" color="#1976D2" />
                <LoadingLabel>Loading...</LoadingLabel>
            </LoadingView>
            }
        </Container>
    )
}

export default Weather

