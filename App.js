import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './MainScreen';
import SetNewAlarmScreen from './SetNewAlarmScreen';
import { AlarmProvider } from './AlarmContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AlarmProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="SetNewAlarm" component={SetNewAlarmScreen} />
          {/* Add screens for SetNewAlarm and ModifyAlarm later */}
        </Stack.Navigator>
      </NavigationContainer>
    </AlarmProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
