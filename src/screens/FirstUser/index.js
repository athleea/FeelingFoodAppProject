import React, { useEffect, useState, useContext} from 'react';
import {Dimensions, Text, View} from 'react-native';

import SplashScreen from 'react-native-splash-screen';

import Styled from 'styled-components/native'

import database from '@react-native-firebase/database'



const Container = Styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
`
const FoodContainer = Styled.FlatList`
    flex: 5;
`;
const FoodImageContainer = Styled.TouchableOpacity`
    align-items: center;
    justify-content: center
    padding: 4px;
`;
const FoodImage = Styled.Image`
    
`
const Title = Styled.Text`
    margin-top: 5px;
    font-size: 16px;
    color: #111111;
    font-weight: bold;
`;


const FirstUser  = () => {

    let getRandomCatagori = (obj) => {
        return obj[Math.floor(Math.random() * obj.length)]
    }   
    let getRandomFood = (obj) => {
        let index = Math.floor(Math.random() * Object.keys(obj).length);
        return Object.values(obj)[index]
    }
    const initTag = () => {
        const tagCatagori = ["Season","Emotion","Weather"]
        let type = getRandomCatagori(tagCatagori)
        setTagType(type);
        try{
            database().ref(`/Tag/Season`).once('value')
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
        const catagori = ["KFood","Stew","CFood","JFood","WFood","Snack","Noodle","Etc"]
        let list = [];
        for(let i=0;i<4;i++){
            let type = getRandomCatagori(catagori)
            await database().ref(`/Food/${type}`).once('value')
            .then(snapshot => {
                let food = getRandomFood(snapshot.val());
                list.push(food)
            });
        }
        setData(list);
    }
    const saveData = async(id) => {
        setCount(count+1);
        const reference = database().ref(`/Tag/${tagType}/${tag}/${id}`);
        return await reference.transaction(currentLikes => {
            if (currentLikes === null) {
                initTag();
                initFood();
                return 1;
            }
            initTag();
            initFood();
            return currentLikes + 1;
        });
    }

    const [data, setData] = useState([]);
    const [tag, setTag] = useState("");
    const [tagType, setTagType] = useState("");
    const [count, setCount] = useState(0)
    
    //let count = 0;

    useEffect( ()=> {
        SplashScreen.hide();
        initTag();
        initFood();
    }, []);

    const ListHeader = () => {
        return(
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', margin: 20}}>
                <Text style={{fontSize: 30, fontWeight: "bold"}}>#{tag}</Text>
            </View>
        );
    }

    return(
        <Container>
            <FoodContainer
                ListHeaderComponent = {ListHeader}
                extraData = {count}
                numColumns = {2}
                data={data}
                keyExtractor={(item, index) => {
                    return `foodlist-${item.id}-${index}`;
                }}
                renderItem={({item, index}) => (
                    <FoodImageContainer
                        onPress={() => {
                            saveData(item.id);
                        }}>
                        <FoodImage
                            source={{uri : item.url}}
                            style={{ width: (Dimensions.get('window').width) / 2 - 10, height: 201}} />
                        <Title>{item.name}</Title>
                    </FoodImageContainer>
                )}
            />
        </Container>
    );
}

export default FirstUser