import React, { useEffect, useState } from 'react'
import Styled from 'styled-components/native'

import database from '@react-native-firebase/database'

const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor: skyblue;
`
const Item = Styled.TouchableOpacity`
  margin: 2px;
  border: 1px;
  border-color: white;
  padding: 5px;
`

const TagText = Styled.Text`
  marginLeft: 10px;
  font-size: 20px;
`

const TagList = ({navigation, route}) => {

    const [key,setKey] = useState([]);
    const [catagori, setCatagori] = useState('')
  
    const initKey = (catagori) => {
      database().ref(`Tag/${catagori}`).once('value', snapshot => {
        let keyArray = Object.keys(snapshot.val());
        setKey(keyArray);
        setCatagori(catagori);
      });
    }
    
    useEffect(()=>{
      initKey(route.params.catagori)
    },[])
  
  
    return(
      <Container>
        {key.map( item => {
          return(
            <Item key={item.toString()}
              onPress={ () =>{
                navigation.navigate('Chart', {tag : item, catagori: catagori})
              }}
            >
              <TagText>{item}</TagText>
            </Item>
          )
        })}
      </Container>
    )
  }



export default TagList