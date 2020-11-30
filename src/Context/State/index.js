import React, {createContext, useEffect, useState} from 'react';
import {Alert} from 'react-native'
import Geolocation from 'react-native-geolocation-service';
import {PermissionsAndroid} from 'react-native';

const API_KEY = ""

const StateContext = createContext();
const StateContextProvider = ({children}) => {

    const setUser = () =>{
        setFirstUser("false");
    }
    const [weatherInfo, setWeatherInfo] = useState({
        granted: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        isLoaded: false,
        icon: "04n",
        weather: "흐림",
        latitude: undefined,
        longitude: undefined,
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
    
    const setCurrentWeather = async() => {
        await requestLocationPermission();
        Geolocation.getCurrentPosition(
            position => {
                console.log(position);
                const {latitude, longitude} = position.coords;
                setWeatherInfo({
                    latitude: latitude,
                    longitude: longitude,
                })
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
                .then(response => response.json())
                .then(json => {
                    setWeatherInfo({
                        isLoaded: true,
                        icon: json.weather[0].icon,
                        weather: getWeatherText(json.weather[0].icon)
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

    useEffect( ()=> {
        setCurrentWeather();
    },[])

    return(
        <StateContext.Provider
            value={{
                weatherInfo,
                getSeason,
                requestLocationPermission
            }}
        >
            {children}
        </StateContext.Provider>
    )
}

export {StateContextProvider, StateContext};
