import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const appTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#0f172a',
        card: '#0f172a',
        text: '#ffffff',
    },
};


// 1. Bottom Tabs Component
function BottomTabs() {
    const insets = useSafeAreaInsets(); // phone ke bottom safe area ko read karega
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // <--- Ye generic "Home", "Search", "Favourites" header ko hide kar dega!
                sceneStyle: { backgroundColor: '#0f172a' },
                tabBarStyle: {
                    backgroundColor: '#0f172a',
                    borderTopColor: '#1e293b',
                    height: 60 + (insets.bottom > 0 ? insets.bottom : 12),
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#38bdf8',
                tabBarInactiveTintColor: '#64748b',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'film' : 'film-outline';
                    else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
                    else if (route.name === 'Favourites') iconName = focused ? 'heart' : 'heart-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Favourites" component={FavouritesScreen} />
        </Tab.Navigator>
    );
}

// 2. Root Navigator (Tabs + Details Stack)
export default function AppNavigator() {
    return (
        <NavigationContainer theme={appTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: '#0f172a' },
                    headerTintColor: '#ffffff',
                    contentStyle: { backgroundColor: '#0f172a' }, // <--- white flash ko khatam karne ke liye
                }}
            >
                <Stack.Screen
                    name="MainTabs"
                    component={BottomTabs}
                    options={{ headerShown: false }} // Tabs ka apna header hai isliye isko hide rakhein
                />
                <Stack.Screen
                    name="MovieDetails"
                    component={MovieDetailsScreen}
                    options={({ route }) => ({
                        title: route.params?.movie?.title || 'Details',
                        headerBackTitle: 'Back',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
