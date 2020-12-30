import React from 'react'
import TagList from './TagList'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const textColor = "#28292b"

const TopTab = createMaterialTopTabNavigator();

const Category = () => {
  return (
    <TopTab.Navigator
      labeled="true"
      tabBarOptions={{
        activeTintColor: '#fff',
        labelStyle: { fontSize : 15 },
        style: { backgroundColor: textColor },
      }}
    >
      <TopTab.Screen
        initialParams={{ category: 'Emotion' }}
        name="Emotion"
        component={TagList}
        options={{ tabBarLabel: '감정' }}
      />
      <TopTab.Screen
        initialParams={{ category: 'Anniversary' }}
        name="Season"
        component={TagList}
        options={{ tabBarLabel: '행사/계절' }}
      />
      <TopTab.Screen
        initialParams={{ category: 'Weather' }}
        name="Weather"
        component={TagList}
        options={{ tabBarLabel: '날씨' }}
      />
    </TopTab.Navigator>
    
  );
}

export default Category