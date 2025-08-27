import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen.js';
import KitapEkle from './screens/kitapEkle';
import KitaplarScreen from './screens/KitaplarScreen';
import KitapDetay from './screens/KitapDetay';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="KitapEkle"
          component={KitapEkle}
          options={{ title: 'Kitap Ekle' }}
        />
        <Stack.Screen
          name="Kitaplar"
          component={KitaplarScreen}
          options={{ title: 'Kitaplarım' }}
        />
        <Stack.Screen name="KitapDetay"
          component={KitapDetay}
          options={{ title: 'Kitap Detayı' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
