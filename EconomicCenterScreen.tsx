// EconomicCenterScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { fetchDataFromSheet, DataItem } from './GoogleSheetsAPI';
import BannerAdComponent from './BannerAdComponent'; // Adjust the path based on your project structure

const EconomicCenterScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [data, setData] = useState<DataItem[]>([]);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('N/A');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        fetchData();
      }
    });
  
    // Ensure route.params and route.params.sheetName are defined before accessing them
    if (route.params && route.params.sheetName) {
      fetchData();
    }
  
    return () => unsubscribe();
  }, [route.params]); // Listen to changes in route.params

  const fetchData = async () => {
    try {
      const { data: sheetData, lastUpdate: sheetLastUpdate } = await fetchDataFromSheet(route.params.sheetName);

      // Set the last update date of the sheet
      setLastUpdate(sheetLastUpdate);

      // Filter data based on the last date
      const lastDateData = sheetData.filter(item => item.Date === sheetLastUpdate);

      // Sort filtered data based on the Date in descending order
      const sortedData = lastDateData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

      setData(sortedData);
      applySearchFilter(sortedData, searchTerm);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applySearchFilter = (data: DataItem[], searchTerm: string) => {
    const filtered = data.filter(item => {
      const itemName = item.Name.toLowerCase();
      const itemKeyword = item.Keyword.toLowerCase(); // Include Keyword field in the search
      const searchTermLower = searchTerm.toLowerCase();

      // Search by Name or Keyword
      return itemName.includes(searchTermLower) || itemKeyword.includes(searchTermLower);
    });

    setFilteredData(filtered);
  };

  const updateNavigationHeader = () => {
    const economicCenterNames = {
      Sheet1: 'Dambulla',
      Sheet2: 'Tambuttegama',
      Sheet3: 'Kappetipola',
      Sheet4: 'NuwaraEliya',
      Sheet5: 'Peliyagoda (FISH)',
      Sheet6: 'Negambo (FISH)',
    };

    const sheetName = route.params.sheetName;
    const economicCenterName = economicCenterNames[sheetName] || 'Unknown';

    navigation.setOptions({ title: `${economicCenterName} Economic Center` });
  };

  const clearSearch = () => {
    setSearchTerm('');
    applySearchFilter(data, ''); // Clear the search filter
    Keyboard.dismiss(); // Dismiss the keyboard
  };

  useEffect(() => {
    applySearchFilter(data, searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    updateNavigationHeader();
  }, [route.params]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {!isConnected && (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      )}

      <View style={styles.lastUpdateContainer}>
        <Text style={styles.lastUpdateText}>Last Update: {lastUpdate}</Text>
      </View>

      {/* Search box */}
      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchBox}
          placeholder="Search by Name (Ex: පොල්, pol, Coconut)"
          placeholderTextColor="#999"
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
        />
        {searchTerm !== '' && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Image source={require('./assets/close.png')} style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{`${item.Name}`}</Text>
            <Text style={styles.priceText}>
              {`Min Price:`}
              <Text style={styles.priceValueGreen}>{` Rs.${item['Minimum Price']}`}</Text>
              {` | Max Price:`}
              <Text style={styles.priceValueRed}>{` Rs.${item['Maximum Price']}`}</Text>
            </Text>

            {/* Conditionally render Retail Price section */}
            {item['RetailPrice'] && (
              <Text style={styles.RetailPrice}>{` (සිල්ලර මි​ල: Rs.${item['RetailPrice']})`}</Text>
            )}
          </View>
        )}
        keyExtractor={(item) => item.Id.toString()}
        contentContainerStyle={styles.listContainer}
      />
          {/* <BannerAdComponent /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  lastUpdateContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  lastUpdateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e222a',
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchBox: {
    flex: 1,
    height: 40,
    color: 'white',
  },
  clearButton: {
    padding: 8,
  },
  clearIcon: {
    width: 20,
    height: 20,
    tintColor: '#12D18E',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    backgroundColor: '#1e222a',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  itemText: {
    color: '#12D18E',
    fontSize: 16,
    marginBottom: 2,
  },
  priceText: {
    fontSize: 16,
    color: '#fff',
  },
  priceValueGreen: {
    fontSize: 16,
    color: '#12D18E',
  },
  priceValueRed: {
    fontSize: 16,
    color: '#f5595b',
  },
  RetailPrice: {
    fontSize: 12,
    color: '#ff1578',
  },
  noInternetContainer: {
    backgroundColor: '#ffcad5',
    padding: 10,
    alignItems: 'center',
  },
  noInternetText: {
    color: '#590b1b',
    fontWeight: 'bold',
  },
});

export default EconomicCenterScreen;
