import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import WeatherText from './WeatherText'

const styles = StyleSheet.create({
    textroom:{
        flex: 1,
        justifyContent:"center",  
        alignItems:"center",          
    },
});



const Weather = ({weatherId}) => {
    return(
        <View style={styles.textroom}>
            <WeatherText weatherId={weatherId}/>
        </View>
    )
}

export default Weather

