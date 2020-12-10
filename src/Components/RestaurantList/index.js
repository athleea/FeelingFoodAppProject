import React from 'react'
import { Dimensions } from 'react-native'
import Styled from 'styled-components/native'

const Container = Styled.TouchableOpacity`
    width: ${Dimensions.get('window').width}px;
    align-items: center;
`
const RestaurantName = Styled.Text`
    font-size: 20px;
    font-weight: bold;
`
const RestaurantLabel = Styled.Text`
    font-size: 15px;
`
const Restaurant = ({name, category, address, phone, onPress}) => {
    return(
        <Container
            onPress={onPress} >
          <RestaurantName>{name}</RestaurantName>
          <RestaurantLabel>{category}</RestaurantLabel>
          <RestaurantLabel>주소 : {address}</RestaurantLabel>
          <RestaurantLabel>번호 : {phone}</RestaurantLabel>
        </Container>
    )
}

export default Restaurant