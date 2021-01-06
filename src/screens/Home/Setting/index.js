import React from 'react'

import Styled from 'styled-components/native'
import FootSelector from './FoodSeletor'

const Container = Styled.SafeAreaView`
  flex: 1;
`
const Title = Styled.Text`
  margin: 10px;
  font-size: 20px;
  font-weight: bold;
`


const Setting = () => {
  return (
    <Container>
      <Title>제외시킬 음식을 선택해주세요</Title>
      <FootSelector />
    </Container>
  )
}

export default Setting