import React, { useEffect, useLayoutEffect, useState } from 'react'
import Styled from 'styled-components/native'
import { FlatList } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialIcons'
import database from '@react-native-firebase/database'
import Banner from '~/Components/Banner'

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
  align-items: center
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
const LikeView = Styled.View`
  flexDirection: row
  align-items: center;
  justify-content: center;
`
const LikeCount = Styled.Text`
  text-align: center;
  font-size: 17px;
  color: ${textColor}
`

const Chart = ({ navigation, route }) => {

  const [data, setData] = useState({
    tag: route.params.tag,
    foodlist: [],
    like: [],
  })

  const initData = () => {

    let foodId = [];
    let food = [];
    let likeCount = [];

    database().ref(`Tag/${data.tag}/like`).orderByValue().once('value', snapshot => {
      snapshot.forEach(element => {
        foodId.push(element.key)
        likeCount.push(element)
      })
      foodId.reverse();
      likeCount.reverse();
    }).then(() => {
      database().ref(`Food/`).once('value', snapshot => {
        foodId.forEach((val, index) => {
          let like = JSON.stringify(likeCount[index])
          food.push(Object.assign(snapshot.child(val).val(), { like: like }))
        });
        setData({ foodlist: food });
      });
    })
  }

  useEffect(() => {
    initData();
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: `#${route.params.tag}` });
  }, [])

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
          <LikeView>
            <Icon name="favorite" size={20} color={'#e6212a'}/>
            <LikeCount> {item.like}</LikeCount>
          </LikeView>
        </FoodLabel>
      </ItemContainer>
    )
  }
  return (
    <Container>
      <Banner />
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