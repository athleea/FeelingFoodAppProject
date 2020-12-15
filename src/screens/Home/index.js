import React, { useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { Dimensions, Image, View, RefreshControl } from 'react-native'

import FoodImageList from './FoodImageList'
import LoadingView from '~/Components/Loading'
import FoodImage from '~/Components/FoodImage'
import { UserContext } from '~/Context/User';

import SplashScreen from 'react-native-splash-screen';
import database from '@react-native-firebase/database';
import Styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundcolor = "#eed974"
const textColor = "#28292b"

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor : ${backgroundcolor};
`;
const SettingButton = Styled.TouchableOpacity`
  marginRight: 20px;
`;
const CatagoriContainer = Styled.View`
  flex:1;
`;
const TagLabel = Styled.TouchableOpacity`
  flexDirection: row;
  align-items: center;
  marginLeft: 10px;
`;
const TagText = Styled.Text`
  color: ${textColor}
  font-size: 20px;
  font-weight: bold;
`



const Home = ({ navigation }) => {
  const { location, isLoaded } = useContext(UserContext)
  const { weather, icon, season } = location

  const [randomFood, setRandomFood] = useState({})
  const [refreshing, setRefreshing] = useState(false);

  const initRandomMainFood = () => {
    database().ref(`/Food`).once('value', snapshot => {
      let length = Object.keys(snapshot.val()).length
      let index = Math.floor(Math.random() * length)
      setRandomFood(snapshot.val()[index]);
      console.log(randomFood)
    });
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <SettingButton
          onPress={() => {
            navigation.navigate('Setting')
          }}>
          <Icon name="cog" size={25} color="#ffffff" />
        </SettingButton>
      )
    })
  }, [])

  useEffect(() => {
    if(isLoaded){
      SplashScreen.hide();  
    }
    initRandomMainFood();
  }, [])

  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    initRandomMainFood();
    wait(1000).then(() => setRefreshing(false));
  }, []);

  return (
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <FoodImage
        size={'cover'}
        width={(Dimensions.get('window').width) - 10}
        height={250}
        fontsize={30}
        food={randomFood}
        onPress={() => {
          navigation.navigate('StackMap', {
            screen: 'Map',
            params: { name: randomFood.name }
          })
        }}
      />
      <CatagoriContainer>
        {isLoaded ?
          <View>
            <TagLabel onPress={() => { navigation.navigate('Chart', { tag: weather, catagori: 'Weather' }) }}>
              <TagText>#현재 날씨 : {weather}</TagText>
              <Image
                source={{ uri: `http://openweathermap.org/img/wn/${icon}@2x.png` }}
                style={{ width: 40, height: 40, marginLeft: 5 }}
              />
            </TagLabel>
            <FoodImageList
              catagori="Weather"
              tag={weather}
              onPress={(food) => {
                navigation.navigate('StackMap', {
                  screen: 'Map',
                  params: { name: food.name }
                });
              }} />
          </View>
          :
          <LoadingView />
        }
        <TagLabel onPress={() => { navigation.navigate('Chart', { tag: season, catagori: 'Anniversary' }) }}>
          <TagText>#{season}</TagText>
        </TagLabel>
        <FoodImageList
          catagori="Anniversary"
          tag={season}
          onPress={(food) => {
            navigation.navigate('StackMap', {
              screen: 'Map',
              params: { name: food.name }
            });
          }} />
      </CatagoriContainer>

    </Container>
  )
}

export default Home