import React from 'react'
import { Text, View } from 'react-native';

class VoteScreen extends React.Component{
  render(){
    return(
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Vote!</Text>
      </View>
    )
  }
}

export default VoteScreen