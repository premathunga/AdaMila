// PriceComparison.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import NetInfo from '@react-native-community/netinfo';
import { fetchDataFromSheet, DataItem } from './GoogleSheetsAPI';
import BannerAdComponent from './BannerAdComponent';

const marketSheetMap = {
  Sheet1: 'Dambulla',
  Sheet2: 'Tambuttegama',
  Sheet3: 'Kappetipola',
  Sheet4: 'NuwaraEliya',
};

const PriceComparison = () => {
  const [selectedMarketSheet, setSelectedMarketSheet] = useState<keyof typeof marketSheetMap>('Sheet1');
  const [selectedName, setSelectedName] = useState<string>('');
  const [priceData, setPriceData] = useState<DataItem[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [names, setNames] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state) {
        setIsConnected(state.isConnected);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isConnected) {
      // Show a no internet alert and return
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK', onPress: () => {} }]
      );
      return;
    }

    fetchNames();
  }, [selectedMarketSheet, isConnected]);

  const fetchNames = async () => {
    try {
      const { data } = await fetchDataFromSheet(selectedMarketSheet);
      const uniqueNames = Array.from(new Set(data.map((item) => item.Name)));
      setNames(uniqueNames);
      // Reset selectedName when market changes
      setSelectedName('');
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  useEffect(() => {
    if (selectedName) {
      fetchDates();
    }
  }, [selectedName]);

  const fetchDates = async () => {
    try {
      const { data } = await fetchDataFromSheet(selectedMarketSheet);
      // Filter data based on the selected name
      const filteredData = data.filter((item) => item.Name === selectedName);
      // Get unique dates from the filtered data
      const uniqueDates = Array.from(new Set(filteredData.map((item) => item.Date))).sort().reverse();
      setDates(uniqueDates);
      // Fetch price data for the selected market, name, and all dates
      fetchPriceData(uniqueDates);
    } catch (error) {
      console.error('Error fetching dates:', error);
    }
  };

  const fetchPriceData = async (selectedDates: string[]) => {
    try {
      const { data } = await fetchDataFromSheet(selectedMarketSheet);
      // Filter data based on the selected name, dates
      const filteredData = data.filter(
        (item) => item.Name === selectedName && selectedDates.includes(item.Date)
      );

      // Sort the filteredData based on Date in descending order
      const sortedData = filteredData.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());

      setPriceData(sortedData);
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  const handleMarketChange = (marketSheet: keyof typeof marketSheetMap) => {
    setSelectedMarketSheet(marketSheet as keyof typeof marketSheetMap);
  };

  const handleNameChange = (name: string) => {
    setSelectedName(name);
  };

  const renderPriceItem = ({ item }: { item: DataItem }) => (
    <View style={styles.priceItem}>
      <Text style={styles.header}>{`Date: ${item.Date}`}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.MinpriceText}>{`Min Price:`}</Text>
        <Text style={styles.greenText}>{`Rs.${item['Minimum Price']}`}</Text>
        <Text style={styles.priceLabelText}>{`|`}</Text>
        <Text style={styles.MaxpriceText}>{`Max Price:`}</Text>
        <Text style={styles.redText}>{`Rs.${item['Maximum Price']}`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.noInternetContainer}>
          <Text style={styles.noInternetText}>No Internet Connection</Text>
        </View>
      )}

      {/* Market selection label */}
      <Text style={styles.label}>Select Market</Text>
      {/* Market selection dropdown */}
      <Picker
        selectedValue={selectedMarketSheet}
        onValueChange={(value) => handleMarketChange(value)}
        style={styles.dropdown}
      >
        {Object.keys(marketSheetMap).map((marketSheet) => (
          <Picker.Item key={marketSheet} label={marketSheetMap[marketSheet]} value={marketSheet as keyof typeof marketSheetMap} />
        ))}
      </Picker>

      {/* Name selection label */}
      <Text style={styles.label}>Select Item</Text>
      {/* Name selection dropdown */}
      <Picker
        selectedValue={selectedName}
        onValueChange={(value) => handleNameChange(value.toString())}
        style={styles.dropdown}
        enabled={selectedMarketSheet !== ''}
      >
        <Picker.Item key="defaultName" label="Select a Name" value="" />
        {names.map((name) => (
          <Picker.Item key={name} label={name} value={name} />
        ))}
      </Picker>

      {selectedName && (
        <>
          <Text style={styles.selectedName}>{`Selected Name: ${selectedName}`}</Text>
          <FlatList
            data={priceData}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={renderPriceItem}
          />
        </>
      )}
      {/* <BannerAdComponent /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
  },
  noInternetContainer: {
    backgroundColor: '#FF0000',
    padding: 10,
    alignItems: 'center',
  },
  noInternetText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  priceItem: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#191919',
  },
  header: {
    fontSize: 16,
    marginBottom: 6,
    backgroundColor: '#0c0c0c',
    color: '#fff',
    padding: 6,
    borderRadius: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  MinpriceText: {
    fontSize: 16,
    color: '#fff',
  },
  MaxpriceText: {
    fontSize: 16,
    color: '#fff',
  },
  greenText: {
    fontSize: 16,
    color: '#12D18E',
  },
  redText: {
    fontSize: 16,
    color: '#f5595b',
  },
  priceLabelText: {
    fontSize: 16,
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
    marginTop: 10,
  },
});

export default PriceComparison;
