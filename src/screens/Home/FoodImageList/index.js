import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'

import FoodImage from '~/Components/FoodImage'
import Loading from '~/Components/Loading'

import Styled from 'styled-components/native'
import database from '@react-native-firebase/database'

const Container = Styled.View``
const TagButton = Styled.TouchableOpacity`
  flexDirection: row;
  align-items: center;
  marginLeft: 10px;
`;
const Label = Styled.Text`
  color: #28292b;
  font-size: 20px;
  font-weight: bold;
`
const WeatherIcon = Styled.Image`
  width: 40px;
  height: 40px;
  marginLeft: 5px;
`

const FoodImageList = ({category, tag, onPress, tagPress, icon, isLoaded}) => {

  const [data, setData] = useState([])
  
  const initFoodList = () => {
    let key = [];
    let food = [];
    
    database().ref(`Tag/${category}/${tag}`).orderByValue().limitToLast(5).once('value', snapshot => {
      snapshot.forEach(value => {
        key.push(value.key)
      })
      key.reverse();
    }).then( () => {
        database().ref(`Food/`).once('value', snapshot=>{
          key.forEach(val => {
              food.push(snapshot.child(val).val())
          });
          setData(food);
      });
    })
  }

  useEffect( ()=> {
    initFoodList();
  },[tag]);

  const renderItem = ({item}) => {
    return(
      <FoodImage
        width={200}
        height={130}
        size={'cover'}
        food={item} 
        onPress={()=>{
          onPress({name: item.name})
        }}
        />
    )
  }

  return(
    isLoaded ? 
      <Container>
        <TagButton onPress={tagPress}>
          <Label>#{tag}</Label>
          {icon ? <WeatherIcon source={{uri : icon}}/>: <></>}
        </TagButton>
        <FlatList
          horizontal={true}
          data={data}
          keyExtractor={(item, index) => {
              return `${item.id}-${index}`;
          }}
          renderItem={renderItem} />
      </Container> :
      <Loading /> 
  );
}

export default FoodImageList