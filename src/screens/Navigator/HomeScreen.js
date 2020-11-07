import React from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import Weather from '~/screens/GetWeather'
import Geolocation from 'react-native-geolocation-service'
import { PermissionsAndroid } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const API_KEY = "6b3df92331ad3dd3d5e970ffe1382aa5"

class HomeScreen extends React.Component{
  
  constructor(props){
    super(props);
    this.state={
      isLoaded : false,
      weatherId: null,
      
    }
  }
  componentDidMount(){
    this.requestCameraPermission()
    Geolocation.getCurrentPosition(
      position => {
        this._getWeather(position.coords.latitude, position.coords.longitude)
      },
      error => {
        console.log(error)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )
  }

  //openweather API 호출
  _getWeather = (lat, lon) =>{
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(json => {
      this.setState({isLoaded: true, weatherId: json.weather[0].id})
    })
  }

  //Android 위치 권한 설정
  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
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
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log("You can use the loation");
      } else {
        //console.log("location permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render(){
    return(
      <ScrollView>
        <View style={styles.container}>
          {this.state.isLoaded? <Weather weatherId={this.state.weatherId} /> :<ActivityIndicator style = {styles.indicator} color='black' size = "large"/>}
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({

  container:{
    flex: 1,
  },
  indicator:{
    flex:1,
    alignItems:"center",
    justifyContent: "center",
  },

});

export default HomeScreen