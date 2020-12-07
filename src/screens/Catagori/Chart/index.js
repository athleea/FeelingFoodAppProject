import React, { useEffect, useState } from 'react'
import Styled from 'styled-components/native'
import {Text, FlatList, View, Image} from 'react-native'

import database from '@react-native-firebase/database'
import { Button } from 'react-native'

const Container = Styled.View`
  backgroundColor: black
`
const ItemContainer = Styled.View`
  margin: 5px;
  flexDirection: row;
  align-items: center;
`
const LankText = Styled.Text`
  color: white
  flex: 0.5;
  
  font-size: 20px;
  font-weight: bold;
`
const FootImage = Styled.Image`
  flex: 1.5
  border-radius: 10px;
`
const FoodName = Styled.Text`
  flex: 3
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
`
const LikeCount = Styled.Text`
  flex: 1
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
`
const Chart = ({route}) => {
  
  const [data, setData] = useState({
    tag : route.params.tag, 
    catagori: route.params.catagori,
    foodlist : [],
    like: [],
  })
  
  const initData = () => {
    let key = [];
    let food = [];
    let likeCount = [];
    database().ref(`Tag/${data.catagori}/${data.tag}`).orderByValue().once('value', snapshot => {
      snapshot.forEach( (value) => {
        key.push(value.key)
        likeCount.push(value)
      })
      key.reverse();
      likeCount.reverse();
    })
    .then(()=>{
      database().ref(`Food/`).once('value',snapshot=>{
        key.forEach( (val, index) => {
          let temp = JSON.stringify(likeCount[index])
          food.push(Object.assign(snapshot.child(val).val(), {like: temp}))
        });
        setData({foodlist: food});  
      });
    })
  }
  useEffect(()=>{ 
    initData();
  },[])

  const renderItem = ({item, index}) => {
    return(
      <ItemContainer>
        <LankText>{index + 1}</LankText>
        <FootImage
          style={{width: 150, height: 120}} 
          source={{uri: item.url}}
        />
        <FoodName>{item.name}</FoodName>
        <LikeCount>♥ {item.like}</LikeCount>
      </ItemContainer>
    )
  }
  return(
    <Container>
      <FlatList
        data={data.foodlist}
        keyExtractor={(item, index) => {
            return `${item.id}-${index}`;
        }}
        renderItem={renderItem} />
    </Container>
  )
}

export default Chart