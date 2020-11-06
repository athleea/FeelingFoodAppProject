import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '~/Screens/HomeScreen'
import SuggestScreen from '~/Screens/SuggestScreen'
import MapScreen from '~/Screens/MapScreen'
import VoteScreen from '~/Screens/VoteScreen'

const Tab = createBottomTabNavigator();

class MainNavigator extends React.Component{
    render(){
        return(
            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Suggest" component={SuggestScreen} />
                <Tab.Screen name="Map" component={MapScreen} />
                <Tab.Screen name="Vote" component={VoteScreen} />
            </Tab.Navigator>
        )
    }
}

export default MainNavigator