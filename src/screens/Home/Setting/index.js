import React, { useState, useEffect } from 'react'
import { View, Text, Button } from 'react-native'
import Styled from 'styled-components/native'

import database from '@react-native-firebase/database'
import MultiSelect from 'react-native-multiple-select';

const Container = Styled.SafeAreaView`
  
`

const MultiSelectExam = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    initFoodData();
  }, [])

  const initFoodData = () => {
    database().ref('/Food').once('value', snapshot => {
      let data = snapshot.val()
      setFoodData(data)
    });
  }

  const onSelectedItemsChange = items => {
    setSelectedItems(items)
  }

  return (
    <Container>
      {/* <Button 
        title={"press"}
        onPress={()=>{console.log(selectedItems)}}
      /> */}
      <MultiSelect
        styleMainWrapper={{
          margin: 10
        }}
        fixedHeight={true}
        items={foodData}
        uniqueKey={'name'}
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="제외시킬 음식"
        textColor="#28292b"
        searchInputPlaceholderText="음식 이름 검색"
        selectedItemTextColor="#CCC"
        selectedItemIconColor="#000"
        tagRemoveIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        tagContainerStyle={{
          width: 200,
          height: 40,
        }}
        fontSize={15}
        tagBorderColor="#28292b"
        tagTextColor="#28292b"
        hideSubmitButton={true}
      />
    </Container>
  )
}
const Setting = ({ navigation, route }) => {
  return (
    <MultiSelectExam />    
  )
}

export default Setting