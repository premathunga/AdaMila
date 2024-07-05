import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EconomicCenterScreen from './EconomicCenterScreen';
import { fetchDataFromSheet } from './GoogleSheetsAPI';
import BannerAdComponent from './BannerAdComponent'; // Adjust the path based on your project structure

const Tab = createBottomTabNavigator();
const TopTab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

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

      const lastDate = data.reduce((maxDate, item) => (item.Date > maxDate ? item.Date : maxDate), '');

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
          style={[styles.button, { marginLeft: 20 }]}
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
          style={[styles.button, { marginLeft: 20 }]}
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
          style={[styles.button, { marginLeft: 20 }]}
          onPress={() => handleButtonPress('EconomicCenterScreen', 'Sheet6')}
        >
          <Text style={styles.buttonText}>Negambo (FISH)</Text>
          <View style={styles.lastUpdateContainer}>
            <Text style={styles.lastUpdateText}>Last Update:</Text>
            <Text style={styles.lastUpdateDate}>{lastUpdateNegombo}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <BannerAdComponent /> */}
    </View>
  );
};

const DailyPrayerScreen = () => {
  // Implement your DailyPrayerScreen component
  return (
    <View style={styles.container}>
      <Text style={styles.noInternet}>Daily Prayer Screen</Text>
    </View>
  );
};

const PrayerCompanionScreen = () => {
  // Implement your PrayerCompanionScreen component
  return (
    <View style={styles.container}>
      <Text style={styles.noInternet}>Prayer Companion Screen</Text>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#12D18E',
        },
        tabBarActiveTintColor: '#fff',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./assets/home-icon.png')} // Adjust the path based on your project structure
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="DailyPrayer"
        component={DailyPrayerScreen}
        options={{
          tabBarLabel: 'Daily Prayer',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./assets/daily-prayer-icon.png')} // Adjust the path based on your project structure
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="PrayerCompanion"
        component={PrayerCompanionScreen}
        options={{
          tabBarLabel: 'Prayer Companion',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('./assets/prayer-companion-icon.png')} // Adjust the path based on your project structure
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const TopTabNavigator = () => {
  return (
    <TopTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        style: {
          backgroundColor: '#12D18E',
        },
        activeTintColor: '#fff',
        indicatorStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <TopTab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <TopTab.Screen
        name="DailyPrayer"
        component={DailyPrayerScreen}
        options={{ tabBarLabel: 'Daily Prayer' }}
      />
      <TopTab.Screen
        name="PrayerCompanion"
        component={PrayerCompanionScreen}
        options={{ tabBarLabel: 'Prayer Companion' }}
      />
    </TopTab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={BottomTabNavigator}
          options={{
            title: '',
            headerStyle: {
              backgroundColor: '#12D18E',
            },
            headerTintColor: '#fff',
            headerTitle: () => (
              <View style={styles.headerTitleContainer}>
                <Image
                  source={require('./assets/title.png')} // Adjust the path based on your project structure
                  style={styles.headerImage}
                />
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="TopTabs"
          component={TopTabNavigator}
          options={{
            headerShown: false,
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
  button: {
    borderBottomWidth: 1,
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
