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

    const [tag, setTag] = useState([]);

    const initKey = (category) => {
      database().ref('Tag').orderByChild('category').equalTo(`${category}`).once('value', snapshot => {
        let tagArray = Object.keys(snapshot.val());
        setTag(tagArray)
      });
    }
    
    useEffect(()=>{
      initKey(route.params.category)
    },[])
  
    return(
      <Container>
        {tag.map( item => {
          return(
            <Item key={item.toString()}
              onPress={ () =>{
                navigation.navigate('Chart', {tag : item})
              }}>
              <TagText>{item}</TagText>
            </Item>
          )
        })}
      </Container>
    )
  }
export default TagList