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
import BmiScreen from '../screens/BMIScreen';
import AddBmiScreen from '../screens/AddBMIScreen';
import NotificationScreen from '../screens/NotificationScreen';
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
        <Stack.Screen name="Register" component={RegisterScreen}/>
        <Stack.Screen name="Bmi" component={BmiScreen}/>
        <Stack.Screen name="AddBMI" component={AddBmiScreen}/>
        <Stack.Screen name="Notification" component={NotificationScreen}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
