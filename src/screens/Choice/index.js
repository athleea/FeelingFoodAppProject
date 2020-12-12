import React, { useContext, useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import {UserContext} from '~/Context/User';

import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'

import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundcolor = "#eed974"
const textColor = "#28292b"

const Container = Styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
    backgroundColor: ${backgroundcolor};
`
const HeaderText = Styled.Text`
    flex: 0.5;
    color: ${textColor}
    fontWeight: bold;
    font-size: 20px;
    marginTop: 10px;
`
const FoodContainer = Styled.FlatList`
    flex: 7;
`;
const FoodImageContainer = Styled.TouchableOpacity`
    align-items: center;
    justify-content: center
    padding: 4px;
`;
const FoodImage = Styled.Image``
const FoodNameLabel = Styled.Text`
    margin-top: 5px;
    font-size: 16px;
    color: ${textColor};
    font-weight: bold;
`;




const Choice  = () => {

    const {setFirstUser, storeData} = useContext(UserContext)

    const getRandomCatagori = (obj) => {
        return obj[Math.floor(Math.random() * obj.length)]
    }   
    const getRandomNumber = (obj) => {
        let num = [0,0,0,0];
        for(let i=0; i<num.length; i++){
            num[i] = Math.floor(Math.random() * Object.keys(obj).length);
            for(let j=0;j<i;j++){
                if(num[i] === num[j]){
                    i--;
                    break;
                }
            }
        }
        return num
    }
    const initTag = () => {
        const tagCatagori = ["Weather","Emotion","Anniversary"]
        let type = getRandomCatagori(tagCatagori)
        setTagType(type);
        try{
            database().ref(`/Tag/${type}`).once('value')
            .then(snapshot => {
                let tags = Object.keys(snapshot.val());
                let randomTag = getRandomCatagori(tags);
                setTag(randomTag);
            });
        }catch(e){
            console.log(e)
        }
    }
    const initFood = async() => {
        let array = [];
        await database().ref(`/Food/`).once('value')
        .then(snapshot => {
            let food = snapshot.val();
            let num = getRandomNumber(food)
            for(let j=0;j<num.length;j++){
                array.push(food[num[j]])
            }
            
        });
        setData(array);
    }
    const saveData = async(id) => {
        const reference = database().ref(`/Tag/${tagType}/${tag}/${id}`);
        return await reference.transaction(currentLikes => {
            setCount(count + 1)
            if(count===5){
                setFirstUser(false)
                storeData('NOT_FIRST_USER')
            }
            if (currentLikes === null) {
                return 1;
            }
            return currentLikes + 1;
        });
    }
    
    

    const [data, setData] = useState([]);
    const [tag, setTag] = useState("");
    const [tagType, setTagType] = useState("");
    const [count, setCount] = useState(0)

    useEffect( ()=> {
        SplashScreen.hide();
        initTag();
        initFood();
    }, []);

    const ListHeader = () => {
        return(
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                <Text style={{ fontSize: 30, fontWeight: "bold",}}>#{tag}</Text>
                <TouchableOpacity
                    style={{
                        right: 20,
                        position: 'absolute',
                        alignSelf: 'flex-end',
                        borderRadius: 10,
                        backgroundColor: '#28292b',
                        justifyContent: 'center', 
                        alignItems: 'center'
                    }}
                    onPress={()=>{
                        initTag();
                        initFood();
                    }}>
                <   Text style={{ padding: 7, color: 'white' }}>pass</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // const ListFooter = () => {
    //     return(
            
    //     );
    // }

    return(
        <Container>
            <HeaderText>태그와 어울리는 음식을 선택해주세요</HeaderText>
            <FoodContainer
                ListHeaderComponent = {ListHeader}
                //ListFooterComponent = {ListFooter}
                numColumns = {2}
                data={data}
                keyExtractor={(item, index) => {
                    return `foodlist-${item.id}-${index}`;
                }}
                renderItem={({item, index}) => (
                    <FoodImageContainer
                        onPress={() => {
                            saveData(item.id).then(()=>{
                                initTag();
                                initFood();
                            })
                        }}>
                        <FoodImage
                            source={{uri : item.url}}
                            style={{ width: (Dimensions.get('window').width) / 2 - 10, height: 201}} />
                        <FoodNameLabel>{item.name}</FoodNameLabel>
                    </FoodImageContainer>
                )}
            />
        </Container>
    );
}

export default Choice