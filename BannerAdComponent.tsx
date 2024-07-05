// BannerAdComponent.tsx
import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
} from 'react-native-google-mobile-ads';

const BannerAdComponent: React.FC = () => {
  return (
    // <View style={styles.bannerBottom}>
    //   <BannerAd
    //     unitId="ca-app-pub-9300488836672428/9541948482" // Replace with your actual ad unit ID
    //     size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER
    //     style={styles.bannerBottom}
    //     }
    //     requestOptions={{
    //       requestNonPersonalizedAdsOnly: true,
    //     }}
    //     onAdFailedToLoad={(error) => console.error('Ad failed to load: ', error)}
    //     // Add any additional props or event handlers as needed
    //   />
    // </View>

<View style={styles.bannerBottom}>
<BannerAd
   unitId="ca-app-pub-9300488836672428/6261328387" // Replace with your actual ad unit ID
   size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} // Choose your desired size from BannerAdSize
  //  size="ANCHORED_ADAPTIVE_BANNER"
  />
 </View> 


  );
};

{/* <View style={styles.bannerBottom}>
     <BannerAd
        unitId="ca-app-pub-9300488836672428/9541948482" // Replace with your actual ad unit ID
        size="ANCHORED_ADAPTIVE_BANNER"
        style={styles.bannerBottom}
       />
      </View>  */}

const styles = StyleSheet.create({
//   adContainer: {
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//   },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

export default BannerAdComponent;
