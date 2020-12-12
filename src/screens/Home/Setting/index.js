import React, {useState, useEffect} from 'react'
import {View, Text,Button} from 'react-native'
import Styled from 'styled-components/native'

const Container = Styled.ScrollView`
  flex: 1
`

const Setting = ({navigation, route}) => {
  return(
    <Text>설정</Text>
  )
}

export default Setting