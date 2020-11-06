import React from 'react'
import { ScrollView } from 'react-native-gesture-handler';


const databaseURI= "https://feelingfoodappproject.firebaseio.com"

class HomeScreen extends React.Component{
  constructor(){
    super();
    this.state = {
      tags:{}
    };
  }

  _get(){
    fetch(`${databaseURI}/Tags.json`).then(res =>{
      if(res.status !=200){
        throw new Error(res.statusText);
      }
      return res.json();
    }).then(tags => this.setState({tags: tags}));
  }
  shouldComponentUpdate(nextProps, nextState){
    return nextState.tags != this.state.tags;
  }
  componentDidMount(){
    this._get();
  }
  render(){
    return(
      {Object.keys(this.state.tags).map()}
      <ScrollView>

      </ScrollView>
    )
  }
}

export default HomeScreen