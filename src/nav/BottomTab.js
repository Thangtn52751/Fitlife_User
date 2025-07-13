import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';

import AnalysisScreen from '../screens/AnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';

import MeditationScreen from '../screens/MeditationScreen';
import ExerciseVideoScreen from '../screens/ExerciseScreen/ExerciseVideoScreen';



const Tab = createBottomTabNavigator();



export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name="home-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Analysis"
        component={ExerciseVideoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name="bar-chart-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
            </View>
          ),
        }}
      />


      <Tab.Screen
        name="MeditationScreen"
        component={MeditationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name="bookmarks-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name="person-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    elevation: 1,
    backgroundColor: '#fff',
    height: 60,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    borderTopWidth: 0.9,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  customButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4DA6FF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#4DA6FF', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 10 }, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
