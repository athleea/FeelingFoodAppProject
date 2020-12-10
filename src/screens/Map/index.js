import React, {useEffect,useContext, useState, useCallback} from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { UserContext } from '~/Context/User';
import Restaurant from '~/Components/RestaurantList';

import Styled from 'styled-components/native'

import MapView, {Marker, PROVIDER_GOOGLE, Circle} from 'react-native-maps';

const backgroundcolor = "#28292b"


const Container = Styled.View`
  justify-content: center;
  flex: 1;
`
const InterfaceView = Styled.View`
  position: absolute
  alignSelf: center;
`
const RestaurantList = Styled.FlatList`
  position: absolute;
  alignSelf: center;
  top: 1%;
  backgroundColor: rgba(40,40,40,0.2) 
`
const Research = Styled.TouchableOpacity`
  position: absolute;
  bottom: 5%
  alignSelf: center;
  width: 100px;
  backgroundColor: ${backgroundcolor};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 5px;
`
const ResearchText = Styled.Text`
  color: white;
  font-size: 15px;
`

const API_KEY = ''

const URL = 'https://dapi.kakao.com/v2/local/search/keyword.json?page=45&size=15&sort=accuracy&category_group_code=FD6'

const Map = ({navigation, route}) => {

  const {location} = useContext(UserContext)

  const [data, setData] = useState({
    latitude: location.latitude,
    longitude: location.longitude
  })
  const [marker, setMarker] = useState([])
  const [query, setQuery] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const [radius, setRadius] = useState(1000)
  const [move, setMove] = useState(true)

  const initMarker = () => {
    setQuery(route.params.name)
    fetch(
      //x = 126.87669615985372 y = 37.507390607185336
      `${URL}&x=${data.longitude}&y=${data.latitude}&radius=${radius}&query=${query}`, {
        method: 'GET',
        headers: {
          Authorization: `KakaoAK ${API_KEY}` 
        }
      })
      .then(response => response.json())
      .then(json => {
        setMarker(json.documents)
        console.log(query)
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
      return setIsFocus(false)
    }, [])
  )
  const renderItem = ({item}) => {
    return(
      <Restaurant 
        name={item.place_name}
        category={item.category_name}
        address={item.address_name}
        phone={item.phone}
        onPress={()=>{navigation.navigate('WebView', {url: item.place_url} )}}
      />
    )
  }

  return(
    <Container>
      <MapView
        style={{flex:1}}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChange={() => {
          setMove(true)
        }}
        onRegionChangeComplete={region => {
          setData({
            latitude: region.latitude,
            longitude: region.longitude,
          });
          setMove(false)
        }}
      >
      <Circle
        strokeWidth={0.5}
        fillColor={'rgba(160,255,0,0.2)'}
        center={{
          latitude: data.latitude,
          longitude: data.longitude,}}
        radius={1000}
      />
      {marker? marker.map((val)=>{
          let lat = parseFloat(val.y)
          let lon = parseFloat(val.x)
          return(
            <Marker
              pinColor={'blue'}
              key={val.id}
              coordinate={{latitude: lat, longitude: lon}}
              title={val.place_name}/>
          )
        }) : <></>
      }
      </MapView>
      <RestaurantList
        extraData={query}
        horizontal={true}
        pagingEnabled={true}
        data={marker}
        keyExtractor={(item, index) => {
            return `item-${index}`;
        }}
        renderItem={renderItem}
      />

      {move ? <></>:
        <Research onPress={initMarker}>
          <ResearchText>현위치 검색</ResearchText>
        </Research>
      }
    </Container>
  )
}


export default Map