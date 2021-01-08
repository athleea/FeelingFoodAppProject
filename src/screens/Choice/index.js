import React, { useEffect, useState, useContext, } from 'react';
import { Dimensions } from 'react-native';

import { UserContext } from '~/Context/User';
import FoodImage from '~/Components/FoodImage'

import Styled from 'styled-components/native'
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen';

const Container = Styled.SafeAreaView`
    flex: 1;
    align-items: center;
    justify-content: center;
    backgroundColor: #eee;
`
const FoodContainer = Styled.FlatList`
    flex: 7;
`;
const HeaderView = Styled.View`
    width: 100%
    flex: 0.6;
    flexDirection: row;
    margin: 10px;
    align-items: center;
    justify-content: center;
`
const TagText = Styled.Text`
    alignSelf: center;
    font-size: 30px;
    font-weight: bold;
`
const CountText = Styled.Text`
    position: absolute;
    left: 20px;
    alignSelf: center;
    font-size: 20px;
    font-weight: bold;
`
const PassButton = Styled.TouchableHighlight`
    position: absolute;
    right: 20px;
    borderRadius: 10px;
    backgroundColor: #28292b;
    justify-content: center;
    align-items: center;
`
const Label = Styled.Text`
    color: white;
    padding: 5px;
`

const Choice = () => {

    const { firstUser, setFirstUser } = useContext(UserContext);
    
    const [data, setData] = useState({
        food: undefined,
        tag: undefined
    });
    const [mainTag, setMainTag] = useState("");
    const [mainFood, setMainFood] = useState([]);
    const [count, setCount] = useState(0);

    let mount = true;

    const initData = () => {
        database().ref('/').once('value').then(snapshot => {
            if (mount) {
                setData({
                    tag: snapshot.val()['Tag'],
                    food: snapshot.val()['Food']
                });
                randomData(snapshot.val()['Tag'], snapshot.val()['Food']);
            }
        });
    }
    const getRandomNumber = (obj) => {
        let num = [0, 0, 0, 0];
        for (let i = 0; i < num.length; i++) {
            num[i] = Math.floor(Math.random() * Object.keys(obj).length);
            for (let j = 0; j < i; j++) {
                if (num[i] === num[j]) {
                    i--;
                    break;
                }
            }
        }
        return num
    }
    
    const randomData = (tag, food) => {
        let array = [];
        let tagKey =  Object.keys(tag);
        let foodKey = Object.keys(food);

        let num = getRandomNumber(foodKey);
        num.forEach(index => {
            array.push(food[foodKey[index]]);
        });
        setMainTag(tagKey[Math.floor(Math.random() * tagKey.length)]);
        setMainFood(array);
    }

    const saveData = async (name) => {
        setCount(count + 1);
        const reference = database().ref(`/Tag/${mainTag}/like/${name}`);
        return await reference.transaction(currentLikes => {
            if (currentLikes === null) {
                return 1;
            }
            return currentLikes + 1;
        });
    }

    useEffect(() => {
        initData();
        setTimeout(() => {
            SplashScreen.hide();
        }, 2000);
        return (() => {
            mount = false
        });
    }, []);

    const renderItem = ({ item }) => {
        return (
            <FoodImage
                food={item}
                onPress={() => {
                    saveData(item.name).then(async () => {
                        if (firstUser && count >= 4) {
                            await AsyncStorage.setItem('user', 'true');
                            setFirstUser(false);
                        } else {
                            randomData(data.tag, data.food);
                        }
                    });
                }}
                width={(Dimensions.get('window').width) / 2 - 10}
                height={200}
                fontsize={16}
            />
        )
    }
    return (
        <Container>
            <HeaderView>
                {firstUser ? <CountText>{count}/5</CountText> : <></>}
                <TagText>#{mainTag}</TagText>
                <PassButton onPress={() => { randomData(data.tag, data.food); }}>
                    <Label>Pass</Label>
                </PassButton>
            </HeaderView>
            <FoodContainer
                numColumns={2}
                data={mainFood}
                keyExtractor={(item, index) => {
                    return `foodlist-${item.id}-${index}`;
                }}
                renderItem={renderItem}
            />
        </Container>
    );
}

export default Choice