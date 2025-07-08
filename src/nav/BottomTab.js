import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen.js';
import ActivityScreen from '../screens/ActivityScreen.js';
import MeditationScreen from '../screens/MeditationScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import TestGPSScreen from '../screens/TestGPSScreen.js';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={styles.customButtonContainer}
    onPress={onPress}
  >
    <View style={styles.customButton}>
      {children}
    </View>
  </TouchableOpacity>
);

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
            <Ionicons
              name="home-outline"
              size={24}
              color={focused ? '#4DA6FF' : '#666'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Analysis"
        component={TestGPSScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="bar-chart-outline"
              size={24}
              color={focused ? '#4DA6FF' : '#666'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="walk-outline" size={28} color="#fff" />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Meditation"
        component={MeditationScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="meditation-outline"
              size={24}
              color={focused ? '#4DA6FF' : '#666'}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={24}
              color={focused ? '#4DA6FF' : '#666'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 12 : 24,
    left: 24,
    right: 24,
    elevation: 0,
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 60,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width:0, height: 5 }, shadowRadius:10 },
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
      ios: { shadowColor: '#4DA6FF', shadowOpacity: 0.3, shadowOffset: { width:0, height:10 }, shadowRadius:10 },
      android: { elevation: 5 },
    }),
  },
});
