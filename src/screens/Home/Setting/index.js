import React, {useState, useEffect} from 'react'
import {Text} from 'react-native'

import CheckBox from '@react-native-community/checkbox'


import Styled from 'styled-components/native'
import database from '@react-native-firebase/database';

const Container = Styled.ScrollView`
  flex: 1
`

const Recommend = ({navigation, route}) => {

  const [toggleCheckBox, setToggleCheckBox] = useState(false)

  useEffect(()=>{
      
  },[])

  return(
    <Container>
      <CheckBox
        disabled={false}
        value={toggleCheckBox}
        onValueChange={(newValue) => setToggleCheckBox(newValue)}
      />
      <Text>한식</Text>
      
    </Container>
  )
}

export default Recommend