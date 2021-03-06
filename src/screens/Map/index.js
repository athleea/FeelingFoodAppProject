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
import { REACT_APP_KAKAO_API_KEY } from '@env'

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
  alignSelf: center
  bottom: 20px;
  backgroundColor: #28292b;
  border-radius: 20px;
`
const ResearchText = Styled.Text`
  padding : 10px;
  color: white;
  font-size: 15px;
`

const API_KEY = REACT_APP_KAKAO_API_KEY;
const URL = 'https://dapi.kakao.com/v2/local/search/keyword.json?page=45&size=15&sort=accuracy&category_group_code=FD6'

const Map = ({ navigation, route }) => {

  const { location, showError } = useContext(UserContext)

  const [region, setRegion] = useState({
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [marker, setMarker] = useState([])
  const [isFocus, setIsFocus] = useState(false)
  const [radius, setRadius] = useState(1000)
  const [move, setMove] = useState(true)
  const [food, setFood] = useState([]);

  let mapview, flatlist;

  const getRestaurantList = (food) => {
    route.params.name = food;
    setIsFocus(true);
    fetch(
      `${URL}&x=${region.longitude}&y=${region.latitude}&radius=${radius}&query=${food}`, {
      method: 'GET',
      headers: {
        Authorization: `KakaoAK ${API_KEY}`
      }
    })
    .then(response => response.json())
    .then(json => {
      setMarker(json.documents);
    })
    .catch(error => {
      console.log(error);
      showError('음식점 정보를 가져오는데 실패했습니다');
    });
  }

  const initDropdownList = () => {
    database().ref('/Food/').once('value', snapshot => {
      setFood(Object.keys(snapshot.val()))
    });
  }

  useEffect(() => {
    initDropdownList();
    getRestaurantList(route.params.name);
  }, []);

  useEffect(() => {
    getRestaurantList(route.params.name);
  }, [isFocus]);

  useFocusEffect(
    useCallback(() => {
      return setIsFocus(false);
    }, [])
  );

  const renderItem = ({ item }) => {
    return (
      <Restaurant
        name={item.place_name}
        category={item.category_name}
        address={item.address_name}
        phone={item.phone}
        onPress={ () => {
          navigation.navigate('WebView', { url: item.place_url });
        }}
      />
    )
  }
  const scorllToFirst = () => {
    if(marker && marker.length > 0){
      flatlist.scrollToIndex({animated: true, index: 0});
    }else{
      showError('음식점 정보를 가져오는데 실패했습니다')
    }
  }
  return (
    <Container>
      <MapView
        ref={ref => mapview = ref}
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
        }}>
        <Circle
          strokeWidth={0.5}
          fillColor={'rgba(160,255,0,0.2)'}
          center={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          radius={radius}/>
        {marker ?
          marker.map((element, index) => {
            let lat = parseFloat(element.y);
            let lon = parseFloat(element.x);
            return (
              <Marker
                onPress={()=>{
                  flatlist.scrollToIndex({animated: true, index: index});
                }}
                pinColor={'#28292b'}
                key={element.id}
                coordinate={{ latitude: lat, longitude: lon }}
                title={element.place_name} />
            )
          }) : <></>
        }
      </MapView>

      <Picker
        selectedValue={route.params.name}
        style={{
          backgroundColor: '#28292b',
          top: 0,
          position: 'absolute',
          width: Dimensions.get('window').width,
          height: 40,
          color: 'white',
        }}
        onValueChange={(itemValue, itemIndex) => {
          getRestaurantList(itemValue);
          scorllToFirst();
        }}>
          {food.map((value, index) => {
            return (
              <Picker.Item key={index} label={value} value={value} />
            )
            })
          }
      </Picker>
      
      <RestaurantList
        ref={element => flatlist = element}
        horizontal={true}
        pagingEnabled={true}
        data={marker}
        keyExtractor={(item, index) => {
          return `${item.place_name}`;
        }}
        renderItem={renderItem}
      />
      <Picker
        mode='dropdown'
        selectedValue={radius}
        style={{
          backgroundColor: 'rgba(20,20,20,0.5)',
          bottom: 20,
          left: 10,
          position: 'absolute',
          alignSelf: 'flex-start',
          width: 100,
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

      {move ? <></> :
        <Research onPress={()=>{
          getRestaurantList(route.params.name);
          scorllToFirst();
        }}>
          <ResearchText>현위치 검색</ResearchText>
        </Research>
      }
      
      <Icon
        name="my-location"
        size={30}
        color="#fff"
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          bottom: 20,
          right: 10,
          backgroundColor: '#28292b',
          borderRadius: 25,
          padding: 5
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