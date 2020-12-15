import React, {useState, useEffect} from 'react'
import {View, Text,Button} from 'react-native'
import Styled from 'styled-components/native'

const backgroundcolor = "#eed974"
const textColor = "#28292b"

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor: ${backgroundcolor};
`
const Title = Styled.Text`
  marginTop: 10px;
  font-size: 25px;
  font-weight: bold;
  color: ${textColor}
  alignSelf: center
`



const Setting = ({navigation, route}) => {
  return(
    <Container>
      <Title>제외할 음식을 선택 하세요</Title>
    </Container>
  )
}

export default Setting