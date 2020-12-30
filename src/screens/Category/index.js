import React from 'react'
import TagList from './TagList'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const textColor = "#28292b"

const TopTab = createMaterialTopTabNavigator();

const Catagori = () => {
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
        initialParams={{ catagori: 'Emotion' }}
        name="Emotion"
        component={TagList}
        options={{ tabBarLabel: '감정' }}
      />
      <TopTab.Screen
        initialParams={{ catagori: 'Anniversary' }}
        name="Season"
        component={TagList}
        options={{ tabBarLabel: '행사/계절' }}
      />
      <TopTab.Screen
        initialParams={{ catagori: 'Weather' }}
        name="Weather"
        component={TagList}
        options={{ tabBarLabel: '날씨' }}
      />
    </TopTab.Navigator>
    
  );
}

export default Catagori