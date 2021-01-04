import React, { useEffect, useContext, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';

import { UserContext } from '~/Context/User';
import Restaurant from './RestaurantList'

import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Picker } from '@react-native-picker/picker';
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import Styled from 'styled-components/native'
import database from '@react-native-firebase/database'

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
  backgroundColor: #28292b;
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

  const [region, setRegion] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [marker, setMarker] = useState([])
  const [query, setQuery] = useState()
  const [isFocus, setIsFocus] = useState(false)
  const [radius, setRadius] = useState(1000)
  const [move, setMove] = useState(true)
  const [food, setFood] = useState([]);

  let mapview, flatlist;


  const initMarker = () => {
    fetch(
      `${URL}&x=${region.longitude}&y=${region.latitude}&radius=${radius}&query=${query}`, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${API_KEY}`
      }
    })
      .then(response => response.json())
      .then(json => {
        setMarker(json.documents);
        setIsFocus(true);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    setQuery(route.params.name)
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
    if (route.params.name) {
      setQuery(route.params.name)
    }
    initMarker();
  }, [isFocus])


  useEffect(() => {
    initMarker();
  }, [query])

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
        ref={map => mapview = map}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        paddingAdjustmentBehavior={'always'}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}

        onRegionChange={() => {
          setMove(true)
        }}
        onRegionChangeComplete={region => {
          setRegion({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
          setMove(false);
        }}
      >
        <Circle
          strokeWidth={0.5}
          fillColor={'rgba(160,255,0,0.2)'}
          center={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          radius={radius}
        />

        {marker ?
          marker.map(element => {
            let lat = parseFloat(element.y);
            let lon = parseFloat(element.x);
            return (
              <Marker
                pinColor={'#28292b'}
                key={element.id}
                coordinate={{ latitude: lat, longitude: lon }}
                title={element.place_name} />
            )
          }) : <></>
        }
      </MapView>
      <Picker
        selectedValue={query}
        style={{
          backgroundColor: '#28292b',
          top: 0,
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: 40,
          color: 'white',
        }}

        onValueChange={(itemValue, itemIndex) => {
          setQuery(itemValue);
          initMarker();
          flatlist.scrollToIndex({animated: true, index: 0});
        }

        }>
        {food.map((value, index) => {
          return (
            <Picker.Item key={index} label={value} value={value} />
          )
        })
        }
      </Picker>
      <RestaurantList
        ref={element => flatlist = element}
        initialScrollIndex={0}
        horizontal={true}
        pagingEnabled={true}
        data={marker}
        keyExtractor={(item, index) => {
          return `item-${index}`;
        }}
        renderItem={renderItem}
      />
      {move ? <></> :
        <Research onPress={()=>{
          initMarker();
          flatlist.scrollToIndex({animated: true, index: 0});
        }}>
          <ResearchText>현위치 검색</ResearchText>
        </Research>
      }
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

      <Icon name="my-location" size={40} color="#28292b" style={{
        position: 'absolute',
        alignSelf: 'flex-end',
        bottom: 30,
        right: 30,
        backgroundColor: '#ffffff',
        borderRadius: 25
      }}
        onPress={() => {
          mapview.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          });
        }}
      />
    </Container>
  );
}
export default Map