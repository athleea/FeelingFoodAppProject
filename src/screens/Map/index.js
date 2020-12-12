import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { UserContext } from '~/Context/User';
import Restaurant from '~/Components/RestaurantList';

import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import Styled from 'styled-components/native'
import database from '@react-native-firebase/database'
import { Dimensions } from 'react-native';


const backgroundcolor = "#28292b"


const Container = Styled.View`
  justify-content: center;
  flex: 1;
`
const RestaurantList = Styled.FlatList`
  position: absolute;
  alignSelf: center;
  top: 7%;
  backgroundColor: rgba(20,20,20,0.2) 
`
const Research = Styled.TouchableOpacity`
  position: absolute;
  alignSelf: center;
  bottom: 5%
  width: 100px;
  backgroundColor: ${backgroundcolor};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
`
const ResearchText = Styled.Text`
  padding : 5px;
  color: white;
  font-size: 15px;
`

const API_KEY = 'd7bfcb1ceec975e2c1a8f6ce48e1abde'
const URL = 'https://dapi.kakao.com/v2/local/search/keyword.json?page=45&size=15&sort=accuracy&category_group_code=FD6'

const Map = ({ navigation, route }) => {

  const { location } = useContext(UserContext)

  const [data, setData] = useState({
    latitude: location.latitude,
    longitude: location.longitude
  })
  const [marker, setMarker] = useState([])
  const [query, setQuery] = useState(route.params.name)
  const [isFocus, setIsFocus] = useState(false)
  const [radius, setRadius] = useState(1000)
  const [move, setMove] = useState(true)
  const [food, setFood] = useState([]);



  const initMarker = () => {
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
        setIsFocus(true)
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    database().ref('/Food/').once('value', snapshot => {
      let list = [];
      let value = snapshot.val()
      value.map(e => {
        list.push(e.name)
      })
      setFood(list)
    })
  }, [])

  useEffect(() => {
    setQuery(route.params.name)
    initMarker();
  }, [isFocus])

  useEffect(() => {
    initMarker();
  }, [query])

  useEffect(() => {

  }, [radius])



  useFocusEffect(
    useCallback(() => {
      return setIsFocus(false)
    }, [])
  )
  const renderItem = ({ item }) => {
    return (
      <Restaurant
        name={item.place_name}
        category={item.category_name}
        address={item.address_name}
        phone={item.phone}
        onPress={() => { navigation.navigate('WebView', { url: item.place_url }) }}
      />
    )
  }

  return (
    <Container>
      <MapView
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        style={{ flex: 1 }}
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
            longitude: data.longitude,
          }}
          radius={radius}
        />

        {marker ? marker.map((val) => {
          let lat = parseFloat(val.y)
          let lon = parseFloat(val.x)
            return (
              <Marker
                pinColor={'blue'}
                key={val.id}
                coordinate={{ latitude: lat, longitude: lon }}
                title={val.place_name} />
            )
          }) : <></>
        }
      </MapView>
      <RestaurantList
        horizontal={true}
        pagingEnabled={true}
        data={marker}
        keyExtractor={(item, index) => {
          return `item-${index}`;
        }}
        renderItem={renderItem}
      />

      {move ? <></> :
        <Research onPress={initMarker}>
          <ResearchText>현위치 검색</ResearchText>
        </Research>
      }
      <Picker
        selectedValue={query}
        style={{
          backgroundColor: backgroundcolor,
          top: 0,
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: 40,
          color: 'white',
        }}

        onValueChange={(itemValue, itemIndex) =>
          setQuery(itemValue)
        }>
        {food.map((value, index) => {
          return (
            <Picker.Item key={index} label={value} value={value} />
          )
        })}
      </Picker>

      <Picker
        mode='dropdown'
        selectedValue={radius}
        style={{
          backgroundColor: 'rgba(20,20,20,0.5)',
          bottom: 30,
          left: 10,
          position: 'absolute',
          alignSelf: 'flex-start',
          width: 110,
          height: 35,
          color: 'white',
          borderRadius: 50,
        }}
        onValueChange={(itemValue, itemIndex) =>
          setRadius(itemValue)
        }>
          <Picker.Item label={'1km'} value={1000} />
          <Picker.Item label={'1.5km'} value={1500} />
          <Picker.Item label={'2km'} value={2000} />
      </Picker>

      <Icon name="my-location" size={40} color="#aa0000" style={{
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 30,
        right: 30,
      }}
        onPress={()=>{
          setData({
            latitude: location.latitude,
            longitude: location.longitude
          })
        }}
      />


    </Container>
  )
}


export default Map