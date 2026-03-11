import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { FridgeProvider } from './src/state/FridgeContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <FridgeProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </FridgeProvider>
    </SafeAreaProvider>
  );
}

