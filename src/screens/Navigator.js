import React, { useContext } from 'react';
import { UserContext } from '~/Context/User';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home'
import Category from './Category'
import Map from './Map'
import Choice from './Choice'
import Setting from './Home/Setting'
import Chart from './Category/Chart'
import FoodWebView from './Map/FoodWebView';

import Icon from 'react-native-vector-icons/FontAwesome';

const BottomTab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const BarColor = '#28292b'
const BarTitleColor = '#ffffff'

const StackHome = () => {
    return (
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
                }} />
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
const StackCategory = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Category"
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

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Map"
                component={Map}
                initialParams={{ name: '돈까스' }}
                options={{ headerShown: false }} />
            <Stack.Screen
                name="WebView"
                component={FoodWebView}
                options={{
                    title: '',
                    headerTintColor: '#ffffff',
                    headerStyle: {
                        backgroundColor: BarColor,
                    },
                }} />
        </Stack.Navigator>
    )
}
const StackChoice = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Choice"
                component={Choice}
                options={{
                    title: '태그와 어울리는 음식을 선택해주세요',
                    headerTintColor: '#ffffff',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: BarColor,
                    },
                }}
            />
        </Stack.Navigator>
    )
}
const MainNavigator = () => {
    return (
        <BottomTab.Navigator
            initialRouteName="Home"
            barStyle={{
                backgroundColor: BarColor
            }}
        >
            <BottomTab.Screen
                name="Home"
                component={StackHome}
                options={{
                    tabBarLabel: '추천',
                    tabBarIcon: ({ focused }) => (
                        focused ? <Icon name="home" size={20} color="#ffffff" />
                            : <Icon name="home" size={20} color="#111111" />
                    )
                }} />
            <BottomTab.Screen
                name="Category"
                component={StackCategory}
                options={{
                    tabBarLabel: '카테고리',
                    tabBarIcon: ({ focused }) => (
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
                    tabBarIcon: ({ focused }) => (
                        focused ? <Icon name="map" size={20} color="#ffffff" />
                            : <Icon name="map" size={20} color="#111111" />
                    )
                }}


            />
            <BottomTab.Screen
                name="StackChoice"
                component={StackChoice}
                options={{
                    tabBarLabel: '선택',
                    tabBarIcon: ({ focused }) => (
                        focused ? <Icon name="mouse-pointer" size={20} color="#ffffff" />
                            : <Icon name="mouse-pointer" size={20} color="#111111" />
                    )
                }}
            />
        </BottomTab.Navigator>
    )
}

export default () => {

    const { firstUser } = useContext(UserContext);

    return (
        <NavigationContainer>
            {firstUser ? <StackChoice /> : <MainNavigator />}
        </NavigationContainer>
    )
}