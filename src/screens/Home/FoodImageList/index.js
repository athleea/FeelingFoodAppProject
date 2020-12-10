import React, {useEffect, useState} from 'react'
import {FlatList} from 'react-native'
import FoodImage from '~/Components/FoodImage'

import database from '@react-native-firebase/database'

const FoodImageList = ({catagori, tag, onPress}) => {

  const [data, setData] = useState([])
  
  const initFoodList = () => {
    let key = [];
    let food = [];
    
    database().ref(`Tag/${catagori}/${tag}`).orderByValue().limitToLast(5).once('value', snapshot => {
      snapshot.forEach(value => {
        key.push(value.key)
      })
      key.reverse();
    }).then( () => {
        database().ref(`Food/`).once('value', snapshot=>{
          key.forEach(val => {
              food.push(snapshot.child(val).val())
          });
          setData(food);
          console.log(data)
      });
    })
  }

  useEffect( ()=> {
    initFoodList();
  },[tag]);

  const renderItem = ({item}) => {
    return(
      <FoodImage
        width={200}
        height={100}
        size={'cover'}
        food={item} 
        onPress={()=>{
          onPress({name: item.name})
        }}
        />
    )
  }

  return(
     
      
      <FlatList
        horizontal={true}
        data={data}
        keyExtractor={(item, index) => {
            return `${item.id}-${index}`;
        }}
        renderItem={renderItem} />
     
    
  );
}

export default FoodImageList