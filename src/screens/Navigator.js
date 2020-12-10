import React,{useContext} from 'react';
import {Image,Text} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import {UserContext} from '~/Context/User';
import Home from './Home'
import Category from './Category'
import Map from './Map'
import Choice from './Choice'
import Setting from './Home/Setting'
import Chart from './Category/Chart'
import FoodWebView from './Map/FoodWebView';

import Icon from 'react-native-vector-icons/FontAwesome';

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BarColor = '#28292b'
const BarTitleColor = '#ffffff'

const StackHome = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Home"
                component={Home} 
                options={{
                    title: '추천',
                    headerTintColor: BarTitleColor,
                    headerStyle: {
                        backgroundColor: BarColor,
                        borderBottomWidth: 0
                    },
                }}

                />
            <Stack.Screen 
                name="Setting"
                component={Setting}
                options={{
                    title: '설정',
                    headerTintColor: BarTitleColor,
                    headerStyle: {
                        backgroundColor: BarColor,
                        borderBottomWidth: 0
                    },
                }} />
        </Stack.Navigator>
    )
}

const StackCategory = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Catagori"
                component={Category}
                options={{
                    title: '카테고리',
                    headerTintColor: BarTitleColor,
                    headerStyle: {
                        backgroundColor: BarColor,
                        borderBottomWidth: 0
                    },
                }}
            />
            <Stack.Screen
                name="Chart"
                component={Chart}
                options={{
                    title: '순위',
                    headerTintColor: BarTitleColor,
                    headerStyle: {
                        backgroundColor: BarColor,
                        borderBottomWidth: 0
                    },
                }} />
        </Stack.Navigator>
    )
}

const StackMap = () => {
    return(
        <Stack.Navigator>
            <Stack.Screen 
                name="Map"
                component={Map}
                initialParams={{ name: '맛집' }}
                options={{headerShown: false}}/>
            <Stack.Screen 
                name="WebView"
                component={FoodWebView}
                options={{
                    title: '',
                    headerTintColor: '#28292b',
                    headerStyle: {
                        backgroundColor: BarColor,
                        borderBottomWidth: 0
                    },
                }}/>
        </Stack.Navigator>
    )
}

const MainNavigator = () => {
    return (
        <NavigationContainer>
            <BottomTab.Navigator
                tabBarOptions={{
                    activeTintColor: BarTitleColor,
                    labelStyle: { fontSize : 12 },
                    style: { backgroundColor: BarColor },
                  }}
            >
                <BottomTab.Screen
                    name="Home"
                    component={StackHome}
                    options={{
                        tabBarLabel: '추천',
                        tabBarIcon: ({color, focused}) => (
                            focused ? <Icon name="home" size={20} color="#ffffff" />
                                    : <Icon name="home" size={20} color="#111111" />
                        )
                    }} />
                <BottomTab.Screen
                    name="Category"
                    component={StackCategory}
                    options={{
                        tabBarLabel: '카테고리',
                        tabBarIcon: ({color, focused}) => (
                            focused ? <Icon name="th-list" size={20} color="#ffffff" />
                                    : <Icon name="th-list" size={20} color="#111111" />
                        )
                    }}
                />
                <BottomTab.Screen 
                    name="StackMap"
                    component={StackMap}
                    options={{
                        tabBarLabel: '지도',
                        tabBarIcon: ({color, focused}) => (
                            focused ? <Icon name="map" size={20} color="#ffffff" />
                                    : <Icon name="map" size={20} color="#111111" />
                        )
                    }}
                    
                    
                />
                <BottomTab.Screen
                    name="Choice"
                    component={Choice}
                    options={{
                        tabBarLabel: '선택',
                        tabBarIcon: ({color, focused}) => (
                            focused ? <Icon name="mouse-pointer" size={20} color="#ffffff" />
                                    : <Icon name="mouse-pointer" size={20} color="#111111" />
                        )
                    }}
                />
            </BottomTab.Navigator>
        </NavigationContainer>
    )
}

export default () => {

    const {isLoaded} = useContext(UserContext);
    return(
        isLoaded ? <MainNavigator /> : <Text>Loading..</Text>
        
    )
}