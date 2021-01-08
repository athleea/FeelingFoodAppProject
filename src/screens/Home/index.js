import React, { useContext, useEffect, useLayoutEffect, useState, useCallback } from 'react'
import { Dimensions, RefreshControl} from 'react-native'

import FoodImageList from './FoodImageList'
import FoodImage from '~/Components/FoodImage'
import { UserContext } from '~/Context/User';

import database from '@react-native-firebase/database';
import Styled from 'styled-components/native'
import Icon from 'react-native-vector-icons/FontAwesome';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Banner from '../../Components/Banner';

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

  const { tagInfo, isLoaded, setCurrentWeather } = useContext(UserContext)

  const [randomFood, setRandomFood] = useState({})
  const [refreshing, setRefreshing] = useState(false);


  const getExcludeFood = async(foodList) => {
    let foods = foodList;

    await AsyncStorage.getItem('food', (error, result) => {
      if(result){
        const excludeFood = JSON.parse(result);
        
        excludeFood.forEach(element => {
          delete foods[element]
        });
      }
      let foodKey = Object.keys(foods)
      let index = Math.floor(Math.random() * foodKey.length);
      setRandomFood(foods[foodKey[index]]);
    });
  }

  const initRandomMainFood = () => {
    database().ref(`/Food`).once('value', snapshot => {
      const food = snapshot.val();
      getExcludeFood(food);
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
    });
  }, []);

  useEffect(() => {
    setCurrentWeather();
    initRandomMainFood();
    setTimeout(()=>{
      SplashScreen.hide();
  }, 1500);
  
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
        size={'center'}
        width={(Dimensions.get('window').width) - 10}
        height={250}
        fontsize={30}
        food={randomFood}
        onPress={() => {
          navigation.navigate('StackMap', { screen: 'Map', params: { name: randomFood.name } });
        }}
      />
      <Banner />
      <CategoryContainer>
        <FoodImageList
          category="Weather"
          tag={tagInfo.weather}
          tagPress={() => { navigation.navigate('Chart', { tag: tagInfo.weather, category: 'Weather' }); }}
          onPress={food => { navigation.navigate('StackMap', { screen: 'Map', params: { name: food.name } }); }}
          isLoaded={isLoaded}
          icon={`http://openweathermap.org/img/wn/${tagInfo.icon}@2x.png`}
        />
        <FoodImageList
          category="Anniversary"
          tag={tagInfo.season}
          tagPress={() => { navigation.navigate('Chart', { tag: tagInfo.season, category: 'Anniversary' }); }}
          onPress={food => { navigation.navigate('StackMap', { screen: 'Map', params: { name: food.name } }); }}
          isLoaded={true}
        />
      </CategoryContainer>
    </Container>
      
  )
}

export default Home