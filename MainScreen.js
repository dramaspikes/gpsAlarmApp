// MainScreen.js
import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAlarmContext } from './AlarmContext';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';


const MainScreen = ({ navigation }) => {
 
    const { alarms, removeAlarm } = useAlarmContext();

    const [selectedAlarm, setSelectedAlarm] = useState(null);
    const [showInfoDialog, setShowInfoDialog] = useState(false);
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

    const openInfoDialog = () => {
      setShowInfoDialog(true);
    };
  
    const closeInfoDialog = () => {
      setShowInfoDialog(false);
    };


  
    const showDeleteModal = (alarm) => {
      setSelectedAlarm(alarm);
      setDeleteModalVisible(true);
    };
  
    const hideDeleteModal = () => {
      setDeleteModalVisible(false);
    };
  
    const handleDelete = () => {
     // Delete the selected alarm
     if (selectedAlarm) {
      removeAlarm(selectedAlarm.id);
    }
      // Close the modal
      hideDeleteModal();
    };

    // Start background location tracking when the MainScreen mounts
    useEffect(() => {
      if (alarms.length > 0) {
        startBackgroundLocationTracking();
      }
    }, [alarms]);

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
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Text style={styles.title}>Location Alarm</Text>
        {/* Info Icon Button */}
        <TouchableOpacity onPress={openInfoDialog}>
            <Ionicons name="information-circle-outline" size={24} color="#454545"/>
        </TouchableOpacity>

      </View>

      {/* "Set New Alarm" Button */}
      <TouchableOpacity
        style={styles.setAlarmButton}
        onPress={() => navigation.navigate('SetNewAlarm')}
      >
        <Text style={styles.setAlarmButtonText}>Set New Alarm</Text>
      </TouchableOpacity>
      {showInfoDialog && (
        <View style={styles.infoDialog}>
        <Text style={styles.infoDialogTitle}>How to Use GPSAlarm</Text>
        <Text style={styles.infoDialogText}>
        Welcome to GPSAlarm! To set an alarm, press the "Set New Alarm" button.{"\n\n"}
        
        There you can name your alarm, choose a target location on the map, as well as a radius within which you would like to be notified. Press "Confirm" to add your alarm.{"\n\n"}
        
        You can delete your alarm by pressing the red x next to its name on the home screen.
        </Text>
        <TouchableOpacity style={styles.infoDialogButton} onPress={closeInfoDialog}>
            <Text style={styles.infoDialogButtonText}>Close</Text>
        </TouchableOpacity>
    </View>
    )}
    <Text style={styles.alarmScrollHeader}>My Alarms</Text>
    <ScrollView>
        {alarms.map((alarm, index) => (
          <View key={index} style={styles.alarmCard}>
            <View style={styles.cardContent}>
              
              {/* <Text style={styles.alarmCardText} >{alarm.alarmName + " can be found at:\n" + alarm.selectedLocation.longitude + ", " + alarm.selectedLocation.latitude + "."}</Text> */}
              <Text style={styles.alarmCardText} numberOfLines={1}>{alarm.alarmName}</Text>
            </View>
            {/* Display other alarm details as needed */}
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity style={styles.deleteButtonWrapper} onPress={() => showDeleteModal(alarm)}>
                <Ionicons name="ios-close-circle" size={36} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Delete Alarm Modal */}
      <Modal isVisible={isDeleteModalVisible}>
        <View style={styles.modalContainer}>
          <Text>Do you want to delete the alarm "{selectedAlarm?.alarmName}"?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={handleDelete}>
              <Text style={styles.modalButton}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={hideDeleteModal}>
              <Text style={styles.modalButton}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  alarmCard: {
    backgroundColor: '#242424',
    padding: 5,
    marginVertical: 10,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    shadowOffset: 1,
    shadowColor: 'grey',
    fontWeight: '500',
    color: '#fefefe',
    flexDirection: 'row',
  },
  alarmCardText:{
    color: "#fefefe",
    fontWeight: '600',
    fontSize: 30,
    marginLeft:10,    
    flex: 1,
    flexWrap: 'wrap',
  },
  alarmScrollHeader:{
    marginBottom:10,
    marginTop:30,
    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'sans-serif',
    alignSelf:'center',
  },
  cardContent: {
    flex: 8,
    marginVertical: 15
  },
  container: {
    flex: 1,
    padding:16
  },
  deleteButtonContainer: {
    flex:2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonWrapper: {
    // backgroundColor: "#444400"
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  modalButton: {
    color: '#3498db',
    fontSize: 18,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  setAlarmButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  setAlarmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoDialog: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    height:'auto',
    width: '100%',
    position:'absolute',
    marginLeft:16,
    marginTop:10,
    zIndex: 2,
    elevation: 3,
  },
  infoDialogTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  infoDialogText: {
    fontSize: 16,
    marginBottom: 16,
  },
  infoDialogButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoDialogButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
});

export default MainScreen;