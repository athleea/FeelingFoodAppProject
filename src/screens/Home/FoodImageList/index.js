import React, {useEffect, useState} from 'react'
import {FlatList, Button } from 'react-native'
import Styled from 'styled-components/native'

import database from '@react-native-firebase/database'


const Container = Styled.View`
`;
const FoodName = Styled.Text`
  font-size: 16px;
  color: white;
  font-weight: bold;
  marginTop: 3px;
`;

const FoodImageContainer = Styled.TouchableOpacity`
  align-items: center;
  padding: 4px;
`;

const FoodImage = Styled.Image`
`;

const FoodImageList = ({catagori, tag}) => {

  const [data, setData] = useState([])
  
  const initFoodList = () => {
    let key = [];
    let food = [];
    
    database().ref(`Tag/${catagori}/${tag}`).orderByValue().limitToLast(5).once('value', snapshot => {
      snapshot.forEach(value => {
        key.push(value.key)
      })
      key.reverse();
    }).then(()=>{
      database().ref(`Food/`).once('value',snapshot=>{
        key.forEach(val => {
            food.push(snapshot.child(val).val())
        });
        setData(food);  
      });
    })
  }

  useEffect( ()=> {
    initFoodList();
  },[]);

  const renderItem = ({item}) => {
    return(
      <FoodImageContainer>
        <FoodImage
          resizeMode="cover"
          source={{uri: item.url}}
          style={{ width: 200, height: 100}}
        />
        <FoodName>{item.name}</FoodName>
      </FoodImageContainer>
    )
  }

  return(
    <Container>
      <FlatList
        horizontal={true}
        data={data}
        keyExtractor={(item, index) => {
            return `${item.id}-${index}`;
        }}
        renderItem={renderItem} />
    </Container>
  );
}

export default FoodImageList