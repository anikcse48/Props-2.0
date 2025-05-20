import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Button, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialIcons  } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import DatabaseView from './DatabaseView';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  initDatabase,
  exportDatabaseToStorage,
  getDatabase,
  getLoggedInUser, 
  logoutUser,
} from './database';

import DataCollectionForm from './DataCollectionForm';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();





function NotificationScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🔔 Notifications</Text>
      <Text>No new notifications</Text>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'DataForm') iconName = 'clipboard-outline';
        else if (route.name === 'Notification') iconName = 'notifications-outline';
        else if (route.name === 'Profile') iconName = 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}>
      <Tab.Screen name="DataForm" component={DataCollectionForm} options={{ title: 'Data Collection' }} />
      <Tab.Screen name="Notification" component={NotificationScreen} options={{ title: 'Notifications' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

function ExportScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Export DB"
        onPress={async () => {
          try {
            await exportDatabaseToStorage();
            Alert.alert('Success', 'Database exported successfully!');
          } catch (e) {
            Alert.alert('Export Failed', e.message);
          }
        }}
      />
    </View>
  );
}

function ImportScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>📥 Import Screen</Text>
    </View>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null means loading
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initDatabase(); // This will create necessary tables if they don't exist
        console.log('Database initialized successfully');
        const userEmail = await SecureStore.getItemAsync('userEmail');
        setIsLoggedIn(!!userEmail); // Auto-login if email exists
      } catch (error) {
        console.error('Error initializing database:', error.message);
        Alert.alert('Database Error', 'Failed to initialize database.');
      } finally {
        setDbReady(true);
      }
    };

    initializeApp();
  }, []);

  const loginHandler = async () => {
    setIsLoggedIn(true);
  };

  const logoutHandler = async () => {
    try {
      await SecureStore.deleteItemAsync('userEmail');
      const db = await getDatabase();
      await db.runAsync('UPDATE users SET is_logged_in = 0');
      setIsLoggedIn(false);
      Alert.alert('Logged Out', 'You have been logged out.');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Logout Error', 'Failed to log out. Please try again.');
    }
  };

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading database...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="#007AFF" />
      <NavigationContainer>
        {!isLoggedIn ? (
          <Drawer.Navigator initialRouteName="Login">
            <Drawer.Screen name="Login">
              {(props) => <LoginScreen {...props} loginHandler={loginHandler} />}
            </Drawer.Screen>
            <Drawer.Screen name="Register">
              {(props) => <RegisterScreen {...props} loginHandler={loginHandler} />}
            </Drawer.Screen>
          </Drawer.Navigator>
        ) : (
          <Drawer.Navigator initialRouteName="Home">
            
            <Drawer.Screen 
                   name="Home"
                   component={HomeTabs} 
                   options={{
                   drawerIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" size={30} color="black" />
                     ),
                   title: '', // No text, only icon
                    }} 
             />
            <Drawer.Screen 
                   name="DatabaseView" 
                   component={DatabaseView} 
                   options={{
                   drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="database-check" size={30} color="black" />
                     ),
                   title: '', // No text, only icon
                    }} 
             />

             <Drawer.Screen 
                   name="Export"
                   component={ExportScreen} 
                   options={{
                   drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="database-export" size={24} color="black" />
                     ),
                   title: 'Export', // No text, only icon
                    }} 
             />

             <Drawer.Screen 
                   name="Import"
                   component={ImportScreen} 
                   options={{
                   drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="database-import" size={24} color="black" />
                     ),
                   title: 'Import', // No text, only icon
                    }} 
             />
            
            <Drawer.Screen name="Logout"
                   //component={ImportScreen} 
                   options={{
                   drawerIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="logout" size={24} color="black" />
                     ),
                   title: 'Logout', // No text, only icon
                    }} >
                  
              {() => (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Button title="Logout" onPress={logoutHandler} />
                </View>
              )}
            </Drawer.Screen>
          </Drawer.Navigator>
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}