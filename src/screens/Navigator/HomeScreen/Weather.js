import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    textroom:{
        marginLeft: 20,
        flex: 1,
        justifyContent:"center",  
        alignItems:"flex-start",          
    },
    textcustom:{
        fontSize:20,              
        color: 'black',           
    },
});



const Weather = ({weatherId}) => {
    const text = (weatherId) => {
        
        switch(Math.floor(weatherId / 100)) {
            case 2:
            case 3:
            case 5:
            case 9:
                return '비';
            case 6:
                return '눈';
            case 7:
                return '흐림'
            case 8:
                return '맑음'
            default:
              return '알 수 없음';
        }
        
    }

    return(
        <View style={styles.textroom}>
            <Text style={styles.textcustom}>#{text(weatherId)}</Text>
        </View>
    )
}

export default Weather

