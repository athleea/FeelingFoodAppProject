import React  from 'react'
import {Image} from 'react-native'
import Styled from 'styled-components/native'

const textColor = "#28292b"

const Container = Styled.View`
    margin: 5px;
    align-items: center
`
const ImageView = Styled.TouchableOpacity`
   
`
const FoodName = Styled.Text`
    marginTop: 10px;
    font-size: 15px;
    font-weight: bold;
    color: ${textColor};
`

const FoodImage = ({food, onPress, width, height, size, fontsize}) => {

    return(
        food ? 
        <Container>
            <ImageView
                onPress={onPress}>
                <Image 
                    style={{
                        borderRadius: 10,
                        width: width,
                        height: height,
                        resizeMode: size
                    }}
                    source={{ uri: food.url }}/>
            </ImageView>
            <FoodName style={{fontSize: fontsize}}>{food.name}</FoodName>
        </Container> : <></>
    )
}

export default FoodImage