import React, { useEffect, useLayoutEffect, useState } from 'react'
import Styled from 'styled-components/native'
import { FlatList } from 'react-native'

import database from '@react-native-firebase/database'

const textColor = "#28292b"


const Container = Styled.SafeAreaView`
  backgroundColor: #eee
`
const ItemContainer = Styled.TouchableOpacity`
  margin: 2px;
  flexDirection: row;
  align-items: center;
`
const LankText = Styled.Text`
  text-align: center;
  flex:1;
  font-size: 20px;
  font-weight: bold;
  color: ${textColor}
`
const FoodLabel = Styled.View`
  flex:4;
`
const FootImage = Styled.Image`
  flex:4;
  border-radius: 15px;
`
const FoodName = Styled.Text`
  text-align: center;
  font-size: 17px;
  font-weight: bold;
  color: ${textColor}
`
const LikeCount = Styled.Text`
  text-align: center;
  font-size: 17px;
  color: ${textColor}
`
const Chart = ({ navigation, route }) => {

  const [data, setData] = useState({
    tag: route.params.tag,
    catagori: route.params.catagori,
    foodlist: [],
    like: [],
  })

  const initData = () => {
    let key = [];
    let food = [];
    let likeCount = [];
    database().ref(`Tag/${data.catagori}/${data.tag}`).orderByValue().once('value', snapshot => {
      snapshot.forEach((value) => {
        key.push(value.key)
        likeCount.push(value)
      })
      key.reverse();
      likeCount.reverse();
    })
      .then(() => {
        database().ref(`Food/`).once('value', snapshot => {
          key.forEach((val, index) => {
            let temp = JSON.stringify(likeCount[index])
            food.push(Object.assign(snapshot.child(val).val(), { like: temp }))
          });
          setData({ foodlist: food });
        });
      })
  }

  useEffect(() => {
    initData();
  }, [])

  useLayoutEffect(()=>{
    navigation.setOptions({ headerTitle: `#${route.params.tag }`});
  },[])

  const renderItem = ({ item, index }) => {
    return (
      <ItemContainer
        onPress={() => {
          navigation.navigate('StackMap', {
            screen: 'Map',
            params: { name: item.name }
          })
        }}
      >
        <LankText>{index + 1}</LankText>
        <FootImage
          resizeMode={'cover'}
          style={{ width: 150, height: 120 }}
          source={{ uri: item.url }}
        />
        <FoodLabel>
          <FoodName>{item.name}</FoodName>
          <LikeCount>♥ {item.like}</LikeCount>
        </FoodLabel>
      </ItemContainer>
    )
  }
  return (
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