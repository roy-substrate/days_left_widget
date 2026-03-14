import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import MoodCheckInScreen from './src/screens/MoodCheckInScreen';
import CircleScreen from './src/screens/CircleScreen';
import ChatScreen from './src/screens/ChatScreen';
import JournalScreen from './src/screens/JournalScreen';
import BreatheScreen from './src/screens/BreatheScreen';
import { colors } from './src/theme/colors';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent.blue,
    background: colors.bg.primary,
    card: colors.bg.secondary,
    text: colors.text.primary,
    border: colors.border.default,
    notification: colors.accent.pink,
  },
};

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Home: '🏠',
    Journal: '📓',
    Breathe: '🌬️',
    Circle: '💜',
  };
  return (
    <View style={styles.tabIcon}>
      <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.5 }]}>
        {icons[label] || '•'}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg.primary,
          borderTopColor: colors.border.subtle,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 85,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.text.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused }) => (
          <TabIcon label={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Breathe" component={BreatheScreen} />
      <Tab.Screen name="Circle" component={CircleScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={DarkTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg.primary },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="MoodCheckIn"
            component={MoodCheckInScreen}
            options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 22,
  },
});
