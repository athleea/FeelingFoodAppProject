import React, { createContext, useState, useEffect } from 'react';
import { Alert } from 'react-native'

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const defaultContext = {
    latitude: 37.507390607185336,
    longitude: 126.87669615985372
};

const API_KEY = '6b3df92331ad3dd3d5e970ffe1382aa5'

const UserContext = createContext(defaultContext);


const UserContextProvider = ({ children }) => {

    const [location, setLocation] = useState({});
    const [isLoaded, setIsLoaded] = useState(true);

    const requestPermission = async () => {
        try {
            if (Platform.OS === "ios") {
                return await Geolocation.requestAuthorization("always");
            }
            if (Platform.OS === "android") {
                return await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,);
            }
        } catch (e) {
            console.log(e);
        }
    };
    const setCurrentLocation = () => {
        requestPermission().then(result => {
            if (result === "granted") {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position)
                        const { latitude, longitude } = position.coords;
                        setCurrentWeather(latitude, longitude);
                    },
                    error => {
                        console.log(error)
                        setIsLoaded(false)
                        showError('위치 정보를 가져오는데에 실패 했습니다');
                    }
                );
            } else {
                setIsLoaded(false)
                showError('위치 정보를 가져오는데에 실패');
            }
        })
    };
    const setCurrentWeather = (lat, lon) => {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
            .then(response => response.json())
            .then(json => {
                console.log(json)
                setLocation({
                    latitude: lat,
                    longitude: lon,
                    icon: json.weather[0].icon,
                    weather: getWeatherText(json.weather[0].icon),
                    season: getSeason(),
                });
                setIsLoaded(true)

            })
            .catch(error => {
                showError('날씨 정보를 가져오는데에 실패');
                setLocation({
                    latitude: lat,
                    longitude: lon,
                    isLoaded: false,
                    icon: undefined,
                    weather: undefined,
                    season: getSeason()
                });
                console.log(error);
                setIsLoaded(false)
            });
    };
    const getWeatherText = (icon) => {

        switch (icon) {
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
            case 12: if (day === 25) return "크리스마스"
            case 1: if (day === 1) return "새해"
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
    const showError = (message) => {
        setTimeout(() => {
            Alert.alert(message);
        }, 500);
    };

    useEffect(() => {
        setCurrentLocation();
    }, []);

    return (
        <UserContext.Provider
            value={{
                location,
                isLoaded,
            }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserContextProvider };