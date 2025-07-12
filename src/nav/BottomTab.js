import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';

import AnalysisScreen from '../screens/AnalysisScreen.js';
import ActivityScreen from '../screens/ActivityScreen.js';
import MeditationScreen from '../screens/MeditationScreen.js';
import ProfileScreen from '../screens/ProfileScreen.js';
import ExerciseVideoScreen from '../screens/ExerciseScreen/ExerciseVideoScreen.js';

import AnalysisScreen from '../screens/AnalysisScreen';
import ActivityScreen from '../screens/ActivityScreen';
import MeditationScreen from '../screens/MeditationScreen';
import ProfileScreen from '../screens/ProfileScreen';


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
            <View style={styles.iconWrapper}>
              <Ionicons name="home-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
              <Text style={[styles.label, { color: focused ? '#4DA6FF' : '#666' }]}>Home</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <Ionicons name="bar-chart-outline" size={22} color={focused ? '#4DA6FF' : '#666'} />
              <Text style={[styles.label, { color: focused ? '#4DA6FF' : '#666' }]}>Analysis</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={{
          tabBarIcon: () => (
            <Ionicons name="walk-outline" size={26} color="#fff" />
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
        }}
      />

      <Tab.Screen
        name="ExerciseVideoScreen"
        component={ExerciseVideoScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconWrapper}>
              <MaterialIcons name="meditation" size={22} color={focused ? '#4DA6FF' : '#666'} />
              <Text style={[styles.label, { color: focused ? '#4DA6FF' : '#666' }]}>Meditation</Text>
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
              <Text style={[styles.label, { color: focused ? '#4DA6FF' : '#666' }]}>Profile</Text>
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
    bottom: Platform.OS === 'android' ? 12 : 24,
    left: 24,
    right: 24,
    elevation: 0,
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 60,
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
