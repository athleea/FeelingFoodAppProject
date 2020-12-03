import React, {useEffect, useState, useCallback} from 'react'
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

const Loading = Styled.ActivityIndicator`
  margin-bottom: 16px;
`;
//               catagori=Weather tag=맑음
const FoodImageList = ({catagori, tag}) => {

  const [data, setData] = useState([]);

  const initFoodList = async() => {
    let key = [];
    let food = [];
    try{
      await database().ref(`Tag/${catagori}/${tag}`).orderByValue().limitToLast(2).once('value', snapshot => {
        key = Object.keys(snapshot.val());
        key.reverse();
      }).then( () => {
        key.forEach(snap => {
          database().ref(`Food/${snap}`).once('value',snapshot=>{
            food.push(snapshot.val());
          });
        })
        setData(food);
        setLoad(false);
      })
    }catch(e){
      console.log("FoodImageList : " + e)
    }
  }

  useEffect( ()=> {
    initFoodList();
  },[]);

  
  //rendering component
  const renderItem = ({item}) => {
    return(
      <FoodImageContainer>
        <FoodImage
            source={{uri: item.url}}
            style={{ width: 200, height: 100}}
        />
        <FoodName>{item.name}</FoodName>
      </FoodImageContainer>
    )
  }

  return(
    <Container>
      <Button 
        title={"press"}
        onPress={()=>{
          console.log(data)
          //음식 id, name, imageUrl 등등
        }}
        />
      <FlatList
        extraData={data}
        horizontal={true}
        data={data}
        keyExtractor={(item, index) => {
            return `${item.id}-${index}`;
        }}
        renderItem={renderItem} />
      
    </Container>
  )
};

export default FoodImageList