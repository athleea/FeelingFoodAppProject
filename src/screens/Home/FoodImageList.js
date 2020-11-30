import React, {useEffect, useState} from 'react'
import {FlatList, Text, TouchableOpacity, Image } from 'react-native'

import Styled from 'styled-components/native'


const Container = Styled.View`
  margin: 8px 0px;
`
const InfoContainer = Styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 8px 16px;
`;

const Title = Styled.Text`
    font-size: 16px;
    color: #FFFFFF;
    font-weight: bold;
`;

const FoodContainer = Styled.View`
    height: 201px;
`;

const FoodImageContainer = Styled.TouchableOpacity`
    padding: 0px 4px;
`;

const FoodImage = Styled.Image`
`;
let les = ""
// foodList = json.season.winter
const FoodImageList = ({tagName}) => {
  const[data, setData] = useState([]);

  useEffect( ()=>{
    setData(foodList)
  });

  

  return(
    <Container>
      <InfoContainer>
        <Title>{tagTitle}</Title>
      </InfoContainer>
      <FoodContainer>
        <FlatList
          horizontal={true}
          data={data.data}
          keyExtractor={(item, index) => {
            return `foodlist-${item.id}-${index}`;
          }}
          renderItem={({item, index}) => (
            <FoodImageContainer>
              <Image
                resizeMode="contain"
                source={require('~/res/images/1000.png')}
                style={{ width: 136, height: 201}} />
              <Title>{item.name}</Title>
            </FoodImageContainer>
          )}
        />
      </FoodContainer>
    </Container>
  )
}

export default FoodImageList