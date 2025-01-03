import React from 'react';
import Movies from './components/Movies';
import MoviesDetails from './components/MoviesDetails';
import SearchHistory from './components/SearchHistory';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="MovieSearch" >
            <Stack.Screen name="MovieSearch" element={Movies} />
            <Stack.Screen name="MovieDetails" element={MoviesDetails} />
            <Stack.Screen name="SearchHistory" element={SearchHistory} />
        </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;