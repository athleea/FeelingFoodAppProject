import React, { useEffect, useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'

import database from '@react-native-firebase/database';


const Container = Styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
`
const HeaderText = Styled.Text`
    flex: 0.5;
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
    color: #111111;
    font-weight: bold;
`;
const SkipButtonContainer = Styled.TouchableOpacity`
    flex: 0.5
    align-items: center;
    justify-content: center;
    backgroundColor: #DDDDDD;
`
const SkipLabel = Styled.Text`
    color: white;
    backgroundColor: gray;
    font-size: 10px;
`


const Choice  = () => {

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
        const tagCatagori = ["Season","Emotion","Weather"]
        let type = getRandomCatagori(tagCatagori)
        setTagType(type);
        try{
            database().ref(`/Tag/${type}`).once('value')
            .then(snapshot => {
                let t = snapshot.val()
                let c = getRandomCatagori(Object.keys(t));
                setTag(c)
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
    const saveData = async(name) => {
        setCount(count+1);
        const reference = database().ref(`/Tag/${tagType}/${tag}/${name}`);
        return await reference.transaction(currentLikes => {
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
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                <Text style={{
                    fontSize: 30, fontWeight: "bold",
                    }}>#{tag}</Text>
                <TouchableOpacity
                    style={{
                        backgroundColor: 'blue'
                    }} 
                    
                />
            </View>
        );
    }
    const ListFooter = () => {
        return(
            <TouchableOpacity
                style={{
                    justifyContent: 'center', 
                    alignItems: 'center'
                }}
                onPress={()=>{
                    initTag();
                    initFood();
                }}
            >
                <Text
                    style={{
                        marginTop: 5,
                        width: Dimensions.get('window').width / 2 ,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: '#fff',
                        textAlign: 'center',
                        padding: 5,
                        backgroundColor: 'gray',
                        color: 'white'
                    }}
                >pass</Text>
            </TouchableOpacity>
        );
    }

    return(
        <Container>
            <HeaderText>태그와 어울리는 음식을 선택해주세요</HeaderText>
            <FoodContainer
                ListHeaderComponent = {ListHeader}
                ListFooterComponent = {ListFooter}
                extraData = {count}
                numColumns = {2}
                data={data}
                keyExtractor={(item, index) => {
                    return `foodlist-${item.id}-${index}`;
                }}
                renderItem={({item, index}) => (
                    <FoodImageContainer
                        onPress={() => {
                            saveData(item.name).then(()=>{
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