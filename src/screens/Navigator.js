import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './Home'
import SuggestScreen from './Suggest'
import MapScreen from './Map'
import VoteScreen from './Vote'
import FirstUser from './FirstUser'

import AsyncStorage from '@react-native-community/async-storage';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
    return(
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Suggest" component={SuggestScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Vote" component={VoteScreen} />
        </Tab.Navigator>
    )
}



export default async() => {

    const firstUser = await AsyncStorage.getItem("FIRSTUSER");

    return ( 
        <NavigationContainer>
            { firstUser==="true" ? <MainNavigator /> : <FirstUser />}
        </NavigationContainer> 
    )
}