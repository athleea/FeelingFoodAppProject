import React from 'react';
import {Platform} from 'react-native';

import { BannerAd, BannerAdSize, TestIds} from '@react-native-firebase/admob';

const adUnitId = Platform.OS === 'ios' ? 'ca-app-pub-7590325598388885/5420344882' : 'ca-app-pub-7590325598388885/4193240731'; //TestIds.BANNER

const Banner = () => {
  return (
    <BannerAd
      unitId={TestIds.BANNER}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={() => {
        console.log('Advert loaded');
      }}
      onAdFailedToLoad={(error)=>{
        console.log(error);
      }}
    />
  );
}

export default Banner