import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../lib/theme';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreateTributeScreen } from '../screens/CreateTributeScreen';
import { TributeDetailScreen } from '../screens/TributeDetailScreen';
import { AddMemoryScreen } from '../screens/AddMemoryScreen';
import { MemoryDetailScreen } from '../screens/MemoryDetailScreen';
import { SlideshowScreen } from '../screens/SlideshowScreen';
import { InviteScreen } from '../screens/InviteScreen';
import { JoinTributeScreen } from '../screens/JoinTributeScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: colors.warm.white,
        borderTopColor: colors.cream[200],
        borderTopWidth: 1,
        height: 85,
        paddingBottom: 25,
        paddingTop: 8,
      },
      tabBarActiveTintColor: colors.amber[600],
      tabBarInactiveTintColor: colors.warm.muted,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '500',
      },
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="flame-outline" size={size} color={color} />
        ),
        tabBarLabel: 'Home',
      }}
    />
    <Tab.Screen
      name="MyTributes"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" size={size} color={color} />
        ),
        tabBarLabel: 'Tributes',
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.warm.offWhite },
        animation: 'fade_from_bottom',
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="CreateTribute" component={CreateTributeScreen} />
      <Stack.Screen name="TributeDetail" component={TributeDetailScreen} />
      <Stack.Screen name="AddMemory" component={AddMemoryScreen} />
      <Stack.Screen name="MemoryDetail" component={MemoryDetailScreen} />
      <Stack.Screen
        name="Slideshow"
        component={SlideshowScreen}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="InviteContributors" component={InviteScreen} />
      <Stack.Screen name="JoinTribute" component={JoinTributeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
