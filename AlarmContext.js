import React, { createContext, useContext, useReducer } from 'react';

// Define the initial state and reducer function
const initialState = {
  alarms: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ALARM':
      return {
        ...state,
        alarms: [...state.alarms, action.payload],
      };
    case 'REMOVE_ALARM':
      return {
        ...state,
        alarms: state.alarms.filter((alarm) => alarm.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create the context
const AlarmContext = createContext();

// Create the context provider component
const AlarmProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addAlarm = (alarm) => {
    const newAlarm = { ...alarm, id: state.alarms.length + 1 };
    dispatch({ type: 'ADD_ALARM', payload: newAlarm });
  };

  const removeAlarm = (alarmId) => {
    dispatch({ type: 'REMOVE_ALARM', payload: alarmId });
  };

  return (
    <AlarmContext.Provider value={{ alarms: state.alarms, addAlarm, removeAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
};

// Create a custom hook to use the context
const useAlarmContext = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmContext must be used within an AlarmProvider');
  }
  return context;
};

export { AlarmProvider, useAlarmContext };