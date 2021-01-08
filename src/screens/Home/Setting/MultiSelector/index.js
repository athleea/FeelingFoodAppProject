import React, { useState, useEffect} from 'react'

import database from '@react-native-firebase/database'
import MultiSelect from 'react-native-multiple-select';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FootSelector = () => {

    const [selectedItems, setSelectedItems] = useState([]);
    const [foodData, setFoodData] = useState([]);

    const initFoodData = () => {
        database().ref('/Food').once('value', snapshot => {
            setFoodData(snapshot.val());
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
        initFoodData();
        initExcludeFood();
    }, [])

    return (
        <MultiSelect
            styleMainWrapper={{margin: 10}}
            fixedHeight={true}
            items={Object.values(foodData)}
            uniqueKey="name"
            onSelectedItemsChange={onSelectedItemsChange}
            selectedItems={selectedItems}
            selectText=" 음식 선택"
            searchInputPlaceholderText="음식 이름 검색"
            altFontFamily="ProximaNova-Light"
            tagRemoveIconColor="#28292b"
            tagBorderColor="#28292b"
            tagTextColor="#28292b"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#28292b' }}
            hideSubmitButton={true}
            submitButtonColor="#28292b"
            submitButtonText="제외"
        />
    )
}

export default FootSelector