import React from 'react';
import {StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    textcustom:{
        fontSize:100,              
        color: 'black',           
    },
});

const WeatherText = ({weatherId}) => {
    const text = (weatherId) => {
        
        switch(Math.floor(weatherId / 100)) {
            case 2:
            case 3:
            case 5:
                return '비';
            case 6:
                return '눈';
            case 7:
                return '흐림'
            case 8:
                return '맑음'
            case 9:
                return '태풍'
            default:
              return '알 수 없음';
          }
        
    }
    

    return(
        
        <Text styles={styles.textcustom}>#{text(weatherId)}</Text>
    )
}

export default WeatherText