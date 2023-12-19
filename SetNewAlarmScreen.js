// SetNewAlarmScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Slider, Button } from '@rneui/base'; 
import MapView, { Marker, Circle } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useAlarmContext } from './AlarmContext';


const SetNewAlarmScreen = ({navigation}) => {
  const [alarmName, setAlarmName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  //const [selectedSound, setSelectedSound] = useState('sound1');
  const [initialRegion, setInitialRegion] = useState(null);
  const { addAlarm } = useAlarmContext();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Set New Alarm',
    });
  }, [navigation]);

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Location permission denied');
      return;
    }

    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  })();
}, []);

  const handleLocationSelect = (coordinate) => {
    setSelectedLocation(coordinate);
  };
  
  const handleConfirm = () => {
    // TODO: Implement logic to save the alarm with selected parameters
    // For now, you can log the selected values
    console.log('Alarm Name:', alarmName);
    console.log('Selected Location:', selectedLocation);
    console.log('Radius:', geofenceRadius);
    // Add the new alarm to the context
    addAlarm({ alarmName, selectedLocation, geofenceRadius });

    // Navigate back to the main screen
    navigation.goBack();
  };

  const formattedRadius = geofenceRadius.toPrecision(5);

  // TODO: Add functions to handle location selection, radius changes, and sound selection
  return ( 
    <View style={styles.container}>
      {/*<Text h4 style={styles.title}>Set New Alarm</Text>*/}

      {/* Alarm Name Input */}
      <Input
        placeholder="Enter alarm name"
        value={alarmName}
        onChangeText={setAlarmName}
      />

      {/* MapView for Location Selection */}
      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          followsUserLocation={true}
          onLongPress={(event) => handleLocationSelect(event.nativeEvent.coordinate)}
        >
          {selectedLocation && (
            <>
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
                onPress={() => handleMarkerPress(selectedLocation)}
              />
              {/* Geofence Circle */}
              <Circle
                center={selectedLocation}
                radius={geofenceRadius}
                fillColor="rgba(255, 0, 0, 0.2)" // Adjust the fill color as needed
                strokeColor="rgba(255, 0, 0, 0.8)" // Adjust the stroke color as needed
              />
            </>
          )} 
        </MapView>
      </View>
      

      {/* Radius Slider */}
      <Text style={styles.label}>Select Radius: {formattedRadius} meters</Text>
      <Slider
        value={geofenceRadius}
        style={styles.slider}
        minimumValue={10}
        maximumValue={2000}
        onValueChange={(value) => setGeofenceRadius(value)}
      />

      {/* Sound Selection Dropdown (using Picker from react-native-elements) */}
      {/* <Text style={styles.label}>Select Alarm Sound</Text>
      <Picker
        selectedValue={selectedSound}
        onValueChange={(value) => setSelectedSound(value)}
      >
        <Picker.Item label="Sound 1" value="sound1" />
        <Picker.Item label="Sound 2" value="sound2" />
        <Picker.Item label="Sound 3" value="sound3" />
      </Picker> */}

      {/* Confirm Button */}
      <Button
        title="Confirm"
        buttonStyle={styles.confirmButton}
        onPress={() => handleConfirm()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderColor: 'green',
    borderWidth: 5,
    borderStyle: 'dotted',
    overflow: 'hidden'
  },
  mapWrapper: {
    flex: 1,
    height: 200,
    marginBottom: 16,
    borderWidth: 5
  },
  map: {
    flex: 1,
    width: 'auto',
    height: 'auto'
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    marginBottom: 5
  },
  confirmButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default SetNewAlarmScreen;