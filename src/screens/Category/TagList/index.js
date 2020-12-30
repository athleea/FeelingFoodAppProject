import React, { useEffect, useState } from 'react'
import Styled from 'styled-components/native'

import database from '@react-native-firebase/database'


const Container = Styled.ScrollView`
  flex: 1;
  backgroundColor: #eee;
`
const Item = Styled.TouchableOpacity`
  padding: 10px;
`

const TagText = Styled.Text`
  marginLeft: 10px;
  font-size: 20px;
  color: #28292b
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