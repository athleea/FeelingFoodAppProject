import React from 'react'
import Styled from 'styled-components/native'

const textColor = "#28292b"
const Conatiner = Styled.View`
  flexDirection: row;
  margin: 10px;
  flex: 1;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Loading = Styled.ActivityIndicator`
  margin-bottom: 16px;
`;

const LoadingLabel = Styled.Text`
  color: ${textColor};
  font-size: 16px;
`;

const LoadingView = () => {
    return(
        <Conatiner>
            <Loading size="small" color="#1976D2" />
            <LoadingLabel>Loading</LoadingLabel>
        </Conatiner>
    )
}


export default LoadingView