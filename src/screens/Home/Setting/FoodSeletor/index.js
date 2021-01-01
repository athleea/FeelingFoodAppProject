import React, { useState, useEffect, useCallback, useContext } from 'react'

import database from '@react-native-firebase/database'
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FootSelector = () => {

    const [selectedItems, setSelectedItems] = useState([]);
    const [foodData, setFoodData] = useState([]);
    

    const initFoodData = () => {
        database().ref('/Food').once('value', snapshot => {
            let data = snapshot.val()
            setFoodData(data)
        });
    }
    const initExcludeFood = async() => {
        await AsyncStorage.getItem('food', (error, result) => {
            if(result){
                const excludefood = JSON.parse(result);
                setSelectedItems(excludefood);
            }
            
        });
    }
    const saveExcludeFood = async(items) => {
        await AsyncStorage.setItem('food', JSON.stringify(items));
    }

    const onSelectedItemsChange = items => {
        setSelectedItems(items);
        saveExcludeFood(items);
    }

    useEffect(() => {
        initExcludeFood();
        initFoodData();
    }, [])

    return (
        <MultiSelect
            styleMainWrapper={{margin: 5}}
            items={foodData}
            uniqueKey="name"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText="음식 선택"
            searchInputPlaceholderText="음식 이름 검색"
            onChangeInput={ (text)=> console.log(text)}
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#28292b"
            tagBorderColor="#28292b"
            tagTextColor="#28292b"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#28292b' }}
            submitButtonColor="#28292b"
            submitButtonText="제외"
        />   
    )
}

export default FootSelector