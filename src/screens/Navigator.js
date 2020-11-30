import React from 'react';
import {Image} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './Home'
import Recommend from './Recommend'
import Map from './Map'
import Choice from './Choice'

// import FirstUser from './FirstUser'
// import AsyncStorage from '@react-native-community/async-storage';

const BottomTab = createBottomTabNavigator();

const MainNavigator = () => {

    
    
    return (
        <NavigationContainer>
            <BottomTab.Navigator>
                <BottomTab.Screen
                    name="Home"
                    component={Home}
                    options={{
                        tabBarIcon: ({color, focused}) => (
                            <Image
                                source={
                                    focused ? require('~/Assets/Images/Tabs/ic_home_color.png')
                                            : require('~/Assets/Images/Tabs/ic_home.png')
                                }
                            />
                        )
                    }} />
                <BottomTab.Screen
                    name="Recommend"
                    component={Recommend}
                    options={{
                        tabBarIcon: ({color, focused}) => (
                            <Image
                                source={
                                    focused ? require('~/Assets/Images/Tabs/ic_recommend_color.png')
                                            : require('~/Assets/Images/Tabs/ic_recommend.png')
                                }
                            />
                        )
                    }}
                />
                <BottomTab.Screen 
                    name="Map"
                    component={Map}
                    options={{
                        tabBarIcon: ({color, focused}) => (
                            <Image  
                                source={
                                    focused ? require('~/Assets/Images/Tabs/ic_map_color.png')
                                            : require('~/Assets/Images/Tabs/ic_map.png')
                                }
                            />
                        )
                    }}
                />
                <BottomTab.Screen
                    name="Choice"
                    component={Choice}
                    options={{
                        tabBarIcon: ({color, focused}) => (
                            <Image
                                source={
                                    focused ? require('~/Assets/Images/Tabs/ic_choice_color.png')
                                            : require('~/Assets/Images/Tabs/ic_choice.png')
                                }
                            />
                        )
                    }}
                />
            </BottomTab.Navigator>
        </NavigationContainer>
    )
}

export default () => {

    return(
        <MainNavigator />
    )
}