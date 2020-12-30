import React, { useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { Dimensions, RefreshControl } from 'react-native'

import FoodImageList from './FoodImageList'
import FoodImage from '~/Components/FoodImage'
import { UserContext } from '~/Context/User';

import database from '@react-native-firebase/database';
import Styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor : #eee;
`;
const SettingButton = Styled.TouchableOpacity`
  marginRight: 20px;
`;
const CategoryContainer = Styled.View`
  flex:1;
`;

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
  }, []);

  useEffect(() => {
    setTimeout(()=>{
      SplashScreen.hide();
  }, 1500);
    initRandomMainFood();
  }, []);

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
      <CategoryContainer>
        <FoodImageList
          category="Weather"
          tag={weather}
          tagPress={() => { navigation.navigate('Chart', { tag: weather, category: 'Weather' }); }}
          onPress={food => { navigation.navigate('StackMap', { screen: 'Map', params: { name: food.name } }); }}
          isLoaded={isLoaded}
          icon={`http://openweathermap.org/img/wn/${icon}@2x.png`}
        />
        <FoodImageList
          category="Anniversary"
          tag={season}
          tagPress={() => { navigation.navigate('Chart', { tag: season, category: 'Anniversary' }); }}
          onPress={food => { navigation.navigate('StackMap', { screen: 'Map', params: { name: food.name } }); }}
          isLoaded={true}
        />
      </CategoryContainer>
    </Container>
      
  )
}

export default Home