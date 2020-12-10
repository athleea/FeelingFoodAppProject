import React, {useEffect,useContext, useState, useCallback} from 'react';
import {Button, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '~/Context/User';

const API_KEY = ''

const URL = 'https://dapi.kakao.com/v2/local/search/keyword.json?page=45&size=15&sort=accuracy&category_group_code=FD6'

const Map = ({route}) => {

  const {location} = useContext(UserContext)

  const [data, setData] = useState({
    latitude: location.latitude,
    longitude: location.longitude
  })
  const [marker, setMarker] = useState([])
  const [query, setQuery] = useState('')
  const [isFocus, setIsFocus] = useState(false)

  const initMarker = () => {
    setQuery(route.params.name)
    fetch(
      //x = 126.87669615985372 y = 37.507390607185336
      `${URL}&x=${data.longitude}&y=${data.latitude}&radius=1000&query=${query}`, {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${API_KEY}` 
        }
      })
      .then(response => response.json())
      .then(json => {
        console.log(json)
        setMarker(json.documents)
        console.log(marker);
        setIsFocus(true)
      })
    .catch(error => {
      console.log(error);
    });
  }

  useEffect(()=>{
    console.log('query : ' + query)
    initMarker();
  },[isFocus])

  useFocusEffect(
    useCallback(() => {
      console.log(route.params.name)
      setIsFocus(true)
      return ()=> setIsFocus(false)
    }, [])
  )

  return(
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={{flex:1}}
        initialRegion={{
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      {marker? marker.map((val)=>{
          let lat = parseFloat(val.y)
          let lon = parseFloat(val.x)
          return(
            <Marker 
              key={val.id}
              coordinate={{latitude: lat, longitude: lon}}
              title={val.place_name}
              description="this is a marker example"/>
          )
        }) : <></>
      }
      </MapView>
  )
}


export default Map