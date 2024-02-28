import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  SelfieScreen,
  AutoSelfieScreen,
  IDCaptureScreen,
  PoseEstimationScreen,
  AndroidNFCScreen,
} from './screens';
import { DocumentCapture } from './screens/DocumentCaptureScreen';

const Stack = createNativeStackNavigator();
export const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SelfieScreen" component={SelfieScreen} />
      <Stack.Screen name="AutoSelfieScreen" component={AutoSelfieScreen} />
      <Stack.Screen name="IDCaptureScreen" component={IDCaptureScreen} />
      <Stack.Screen name="AndroidNFCScreen" component={AndroidNFCScreen} />
      <Stack.Screen name="DocumentCapture" component={DocumentCapture} />
      <Stack.Screen
        name="PoseEstimationScreen"
        component={PoseEstimationScreen}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
