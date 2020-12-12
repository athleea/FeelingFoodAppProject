import React, { useEffect, useState } from 'react'
import {Picker} from '@react-native-picker/picker';

const FoodList = () => {

    const [language, setLanguage] = useState('java');

    return (
        <Picker
            selectedValue={language}
            style={{height: 50, width: 300}}
            onValueChange={(itemValue, itemIndex) =>
                setLanguage(itemValue)
            }>
                {data.map(e=>{
                    return(
                        <Picker.Item label={e} value={e} />
                    )
                })}
            
        </Picker>
    );
}

export default FoodList