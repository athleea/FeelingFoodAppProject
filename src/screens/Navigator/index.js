import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen'
import SuggestScreen from './SuggestScreen'
import MapScreen from './MapScreen'
import VoteScreen from './VoteScreen'

const Tab = createBottomTabNavigator();

class Navigator extends React.Component{
    render(){
        return(
            <NavigationContainer>
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeScreen} />
                    <Tab.Screen name="Suggest" component={SuggestScreen} />
                    <Tab.Screen name="Map" component={MapScreen} />
                    <Tab.Screen name="Vote" component={VoteScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        )
    }
}

export default Navigator