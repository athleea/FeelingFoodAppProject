import React, {useEffect} from 'react';
import {View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

const API_KEY = ''

const Map = () => {

  // const [data, setData] = useState({
  //   foodName: route.params.name,
  //   longitude: undefined,
  //   latitude: undefined,
  // })
  
  const initData = () => {
    fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?
      page=1&size=15&sort=accuracy&query=유한대&category_group_code=FD6&x=126.87669615985372&y=37.507390607185336&radius=1000`, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${API_KEY}` 
      },
    }).then(response => response.json())
      .then(json => {
        console.log(json)
      })
      .catch(error => {
        console.log(error);
      });
  }


  useEffect(()=>{
    initData();
  })

  return(
    <View style={{flex:1}}>
      <MapView 
        style={{flex:1}}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  )
}



export default Map