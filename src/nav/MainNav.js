import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình ở đây
import SplashScreen from '../screens/SplashScreen';
import OnBoardingScreen from '../screens/OnboardingCarousel';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTab from './BottomTab';
import ForgotPasswordScreen from '../screens/ForgotPassword';
import ConfirmationCodeScreen from '../screens/ConfrimPassword';
import ResetPasswordScreen from '../screens/ChangePassword';
import DrinkWaterScreen from '../screens/DrinkWaterScreen';
import WaterGoalScreen from '../screens/WaterGoalScreen';
import WaterEntryScreen from '../screens/WaterEntryScreen';
import CongratulationScreen from '../screens/CongratulationScreen';
import ReportWaterScreen from '../screens/ReportWaterScreen';
import WaterHistory from '../screens/WaterHistory';

import MusicListScreen from '../screens/MusicListScreen';
import PlayerScreen from '../screens/PlayMusic';
const Stack = createNativeStackNavigator();

export default function MainNav() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
          }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
          }}
        />
        <Stack.Screen name="ConfirmationCode" component={ConfirmationCodeScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
          }}
        />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTintColor: '#000000',
          }}
        />
        <Stack.Screen name="Home" component={BottomTab} />

          <Stack.Screen name="WaterEntryScreen" component={WaterEntryScreen} options={{ headerShown: false }} />
          <Stack.Screen name="WaterGoalScreen" component={WaterGoalScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DrinkWaterGlassScreen" component={DrinkWaterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CongratulationScreen" component={CongratulationScreen} options={{ headerShown: false}}/>
          <Stack.Screen name="ReportWaterScreen" component={ReportWaterScreen} options={{ headerShown: false}}/>
           <Stack.Screen name="WaterHistory" component={WaterHistory} options={{ headerShown: false}}/>
        <Stack.Screen name='MusicListScreen' component={MusicListScreen}/>
        <Stack.Screen name='PlayerScreen' component={PlayerScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
