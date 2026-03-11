import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FridgeScreen from '../screens/FridgeScreen';
import AddItemScreen from '../screens/AddItemScreen';
import RecipeSuggestionsScreen from '../screens/RecipeSuggestionsScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import ExpiryAlertsScreen from '../screens/ExpiryAlertsScreen';

export type RootStackParamList = {
  Tabs: undefined;
  RecipeDetail: { recipeId: string };
};

export type TabParamList = {
  Fridge: undefined;
  AddItem: undefined;
  Recipes: undefined;
  ExpiryAlerts: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Fridge" component={FridgeScreen} />
      <Tab.Screen name="Add Item" component={AddItemScreen} options={{ title: 'Add Item' }} />
      <Tab.Screen
        name="Recipes"
        component={RecipeSuggestionsScreen}
        options={{ title: 'Recipe Suggestions' }}
      />
      <Tab.Screen
        name="ExpiryAlerts"
        component={ExpiryAlertsScreen}
        options={{ title: 'Expiry Alerts' }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={Tabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecipeDetail"
        component={RecipeDetailScreen}
        options={{ title: 'Recipe Detail' }}
      />
    </Stack.Navigator>
  );
}

