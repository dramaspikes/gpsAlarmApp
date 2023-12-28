// SetNewAlarmScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { Input, Slider, Button } from '@rneui/base'; 
import MapView, { Marker, Circle } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { useAlarmContext } from './AlarmContext';
import Modal from 'react-native-modal';


const SetNewAlarmScreen = ({navigation}) => {
  const [alarmName, setAlarmName] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [geofenceRadius, setGeofenceRadius] = useState(100);
  //const [selectedSound, setSelectedSound] = useState('sound1');
  const [initialRegion, setInitialRegion] = useState(null);
  const { addAlarm } = useAlarmContext();
  const [modalMessage, setModalMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);


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
    // Set the current location
    setCurrentLocation({
      latitude,
      longitude,
    });
  })();
}, []);

  const handleLocationSelect = (coordinate) => {
    setSelectedLocation(coordinate);
  };
  
  const handleConfirm = () => {
// Check if all required fields are filled
    if (!alarmName) {
      showAlert('Alarm Name is required.');
      return;
    }

    if (!selectedLocation) {
      showAlert('Selected Location is required.');
      return;
    }

    if (!geofenceRadius) {
      showAlert('Geofence Radius is required.');
      return;
    }

      // Check if the current location is inside the geofence radius
    if (isCurrentLocationInsideRadius()) {
      showAlert('Your current location must be outside the geofence radius.');
      return;
  }

    // Add the new alarm to the context
    addAlarm({ alarmName, selectedLocation, geofenceRadius });
    // Start background location tracking
    startBackgroundLocationTracking();
    // Navigate back to the main screen
    navigation.goBack();
  };

  const isCurrentLocationInsideRadius = () => {
    // Check if the distance between the current location and the selected location is within the geofence radius
    if (selectedLocation) {
      const distance = calculateDistance(currentLocation, selectedLocation);
  
      return distance <= geofenceRadius / 1000;
    }
  
    return false;
  };
  
  const calculateDistance = (location1, location2) => {
    // Implement a function to calculate the distance between two coordinates
    // using the Haversine formula
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = toRadians(location1.latitude);
    const lon1 = toRadians(location1.longitude);
    const lat2 = toRadians(location2.latitude);
    const lon2 = toRadians(location2.longitude);
  
    const dlat = lat2 - lat1;
    const dlon = lon2 - lon1;
  
    const a =
      Math.sin(dlat / 2) * Math.sin(dlat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) * Math.sin(dlon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
  
    return distance;
  };
  
  const toRadians = (angle) => {
    return (angle * Math.PI) / 180;
  };

  const showAlert = (message) => {
    // Set the modalMessage to mention the specific missing field
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    // Reset the state to preserve entered data
    setModalVisible(false);
    setModalMessage('');
  };

  const formattedRadius = geofenceRadius.toPrecision(5);

  const startBackgroundLocationTracking = async () => {
    await Location.startLocationUpdatesAsync('backgroundLocationUpdates', {
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000, // 5 seconds (adjust as needed)
      foregroundService: {
        notificationTitle: 'Location Tracking',
        notificationBody: 'Active',
      },
    });
  };


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
                fillColor="rgba(255, 0, 0, 0.2)" 
                strokeColor="rgba(255, 0, 0, 0.8)" 
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
      {/* Modal for alerting the user */}
      <Modal style={styles.modal} visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Missing Information</Text>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  label: {
    fontSize: 18,
    marginBottom: 8,
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
  modal: {
    flex: 1,
    maxHeight: 300,
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#999999',
    borderRadius: 8,
    margin: 20,
    padding: 16,
  },
  
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  
  modalButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    marginBottom: 5
  },

});


export default SetNewAlarmScreen;