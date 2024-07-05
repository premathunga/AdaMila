import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EconomicCenterScreen from './EconomicCenterScreen';
import { fetchDataFromSheet } from './GoogleSheetsAPI';
import PriceComparison from './PriceComparison'; // Adjust the path based on your project structure

import BannerAdComponent from './BannerAdComponent'; // Adjust the path based on your project structure

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [lastUpdateDambulla, setLastUpdateDambulla] = useState<string>('N/A');
  const [lastUpdateTambuttegama, setLastUpdateTambuttegama] = useState<string>('N/A');
  const [lastUpdateCappetipola, setLastUpdateCappetipola] = useState<string>('N/A');
  const [lastUpdateNuwaraEliya, setLastUpdateNuwaraEliya] = useState<string>('N/A');
  const [lastUpdatePeliyagoda, setLastUpdatePeliyagoda] = useState<string>('N/A');
  const [lastUpdateNegombo, setLastUpdateNegombo] = useState<string>('N/A');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const fetchLastUpdate = async (sheetName: string, setLastUpdate: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const { data, lastUpdate } = await fetchDataFromSheet(sheetName);

      // Find the last date from the data
      const lastDate = data.reduce((maxDate, item) => (item.Date > maxDate ? item.Date : maxDate), '');

      // Set the last date in the state
      setLastUpdate(lastDate || 'N/A');
    } catch (error) {
      console.error(`Error fetching last update for ${sheetName}:`, error);
    }
  };

  useEffect(() => {
    const checkInternetConnection = async () => {
      try {
        const netInfoState = await NetInfo.fetch();
        setIsConnected(netInfoState.isConnected);
      } catch (error) {
        console.error('Error checking internet connection:', error);
      }
    };

    const handleConnectivityChange = (state: NetInfo.NetInfoState) => {
      setIsConnected(state.isConnected);
    };

    const fetchDataAndUpdate = async () => {
      await fetchLastUpdate('Sheet1', setLastUpdateDambulla);
      await fetchLastUpdate('Sheet2', setLastUpdateTambuttegama);
      await fetchLastUpdate('Sheet3', setLastUpdateCappetipola);
      await fetchLastUpdate('Sheet4', setLastUpdateNuwaraEliya);
      await fetchLastUpdate('Sheet5', setLastUpdatePeliyagoda);
      await fetchLastUpdate('Sheet6', setLastUpdateNegombo);
    };

    const subscribeToConnectivityChanges = () => {
      const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
      return () => unsubscribe();
    };

    checkInternetConnection();
    fetchDataAndUpdate();

    const unsubscribeFromConnectivityChanges = subscribeToConnectivityChanges();

    return () => {
      unsubscribeFromConnectivityChanges();
    };
  }, [isConnected]);

  const handleButtonPress = (destination: string, sheetName: string) => {
    navigation.navigate(destination, { sheetName });
  };

  const handlePriceComparisonPress = () => {
    navigation.navigate('PriceComparison');
  };

  const handleFishPricesScreenPress = () => {
    navigation.navigate('FishPricesScreen');
  };

return (
  <View style={styles.container}>
     {isConnected === false && (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternet}>No Internet Connection!</Text>
          <Text style={styles.noInternetText}>Internet is required to update the price list!</Text>
        </View>
      )}
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={styles.crossButton}
        onPress={handlePriceComparisonPress}
      >
        <Image
          source={require('./assets/x.png')} // Adjust the path based on your project structure
          style={styles.crossIcon}
        />
      </TouchableOpacity>

        <Image
          source={require('./assets/y.png')} // Adjust the path based on your project structure
          style={styles.yIcon}
        />

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet1')}
        >
          <Text style={styles.buttonText}>Dambulla</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateDambulla}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginLeft: 20 }]}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet2')}
        >
          <Text style={styles.buttonText}>Tambuttegama</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateTambuttegama}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet3')}
        >
          <Text style={styles.buttonText}>Keppetipola</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateCappetipola}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginLeft: 20 }]}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet4')}
        >
          <Text style={styles.buttonText}>NuwaraEliya</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateNuwaraEliya}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet5')}
        >
          <Text style={styles.buttonText}>Peliyagoda (FISH)</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdatePeliyagoda}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginLeft: 20 }]}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet6')}
        >
          <Text style={styles.buttonText}>Negambo (FISH)</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateNegombo}</Text>
          </View>
        </TouchableOpacity>
        {/* Other buttons... */}
      </View>
      {/* No internet connection view... */}
    </View>
    <BannerAdComponent />
  </View>
);
};


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Home">
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{
      title: '',
      headerStyle: {
        backgroundColor: '#12D18E',
      },
      headerTintColor: '#fff',
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('./assets/title.png')}
            style={styles.headerImage}
          />
        </View>
      ),
    }}
  />
  <Stack.Screen 
    name="EconomicCenterScreen" 
    component={EconomicCenterScreen} 
    options={{
      headerStyle: {
        backgroundColor: '#12D18E',
      },
      headerTintColor: '#fff',
    }}
  />
  <Stack.Screen 
    name="PriceComparison" 
    component={PriceComparison} // Replace "PriceComparison" with the actual component name
    options={{
      headerStyle: {
        backgroundColor: '#12D18E',
      },
      headerTintColor: '#fff',
headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <Image
            source={require('./assets/z.png')}
            style={styles.zIcon}
          />
        </View>
      ),

    }}
    
    
  />
</Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      backgroundColor: '#000',
    },
    buttonsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      // flex: 1,
      width: '100%',
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    button: {
      flex: 1,
      height: 175,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1e222a',
    },
    buttonText: {
      color: '#12D18E',
      fontWeight: 'bold',
      fontSize: 18,
      marginTop: 10,
    },
    crossButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 10,
      backgroundColor: '#1e222a',
      marginBottom: 15,
    },
    crossIcon: {
      width: '100%',
      height: 40,
      // tintColor: '#fff',
    },
    // yButton: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   padding: 5,
    //   borderRadius: 10,
    //   // backgroundColor: '#1e222a',
    //   marginBottom: 5,
    // },
    yIcon: {
      width: '100%',
      height: 28,
      marginBottom: 5,
      // tintColor: '#fff',
    },

    zIcon: {
      width: '90%',
      height: 28,
      // marginBottom: 5,
      // tintColor: '#fff',
    },

  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 120,
    height: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  lastUpdateContainer: {
    marginTop: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lastUpdateText: {
    color: 'white',
    fontSize: 12,
  },
  lastUpdateDate: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noInternetContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginBottom: 20,
  },
  noInternet: {
    color: '#ffcad5',
    fontWeight: 'bold',
  },
  noInternetText: {
    color: '#fff',
  },
});

export default App;
