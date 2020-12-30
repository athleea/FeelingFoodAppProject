import React from 'react'
import { Dimensions } from 'react-native'
import Styled from 'styled-components/native'

const Container = Styled.TouchableOpacity`
    width: ${Dimensions.get('window').width}px;
    align-items: center;
`
const RestaurantName = Styled.Text`
    color: #ffffff;
    font-size: 20px;
    font-weight: bold;
`
const RestaurantDetails = Styled.Text`
    font-size: 15px;
`
const Restaurant = ({name, category, address, phone, onPress}) => {
    return(
        <Container
            onPress={onPress} >
          <RestaurantName>{name}</RestaurantName>
          <RestaurantDetails>{category}</RestaurantDetails>
          <RestaurantDetails>주소 : {address}</RestaurantDetails>
          <RestaurantDetails>번호 : {phone}</RestaurantDetails>
        </Container>
    )
}

export default Restaurant