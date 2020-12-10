import React  from 'react'
import {Image,Dimensions} from 'react-native'
import Styled from 'styled-components/native'



const Container = Styled.View`
    margin: 10px;
    align-items: center
`
const ImageView = Styled.TouchableOpacity`
   
`
const FoodName = Styled.Text`
    marginTop: 10px;
    font-size: 20px;
    font-weight: bold;
`

const FoodImage = ({food, onPress, width, height, size}) => {

    return(
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
            <FoodName>{food.name}</FoodName>
        </Container>
    )
}

export default FoodImage