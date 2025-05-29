import React, { Component } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Xyz from '../Menu/Xyz';
import DrawerNavigator from '../navigation/Bottomtabnavigation.js/DrawerNavigator';
import Login from '../Tabnavi/Login';
import Home from '../Tabnavi/Home';
import DragDrop from '../DragVideos/DragDrop';
import LogoutScreen from '../Components/LogoutScreen';

export default class Mynewstack extends Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          gestureEnabled: true,
          headerShown: true,
          cardStyleInterpolator: ({ current, next, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        {/* Login Screen with Gradient Background and Icon */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: '#8E44AD', // Purple gradient color
            },
          }}
        />

        {/* Home Screen with Fade-In Animation and Colorful Header */}
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: 'Welcome Home',
            headerStyle: {
              backgroundColor: '#1E90FF', // Blue header background
              shadowOpacity: 0, // Remove shadow for a flat look
            },
            headerTintColor: '#FFF', // White text in the header
            cardStyle: {
              opacity: 0, // initial opacity for fade-in
              backgroundColor: '#87CEEB', // Sky Blue background
            },
            animation: 'fade',
            animationTypeForReplace: 'push',
            transitionSpec: {
              open: { animation: 'timing', config: { duration: 500 } },
              close: { animation: 'timing', config: { duration: 300 } },
            },
          }}
        />

        {/* Drawer Navigator Screen with Custom Header */}
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: '#FF6347', // Tomato background color
            },
          }}
        />

        <Stack.Screen
          name="LogoutScreen"
          component={LogoutScreen}
          options={{
            cardStyle: {
              backgroundColor: '#DC143C', // Crimson background color
            },
          }}
        />

        {/* Drag and Drop Videos Screen with Custom Transition */}
        <Stack.Screen
          name="DragDropVideos"
          component={DragDrop}
          options={{
            headerShown: false,
            cardStyle: {
              backgroundColor: '#FF1493', // Deep Pink background color
            },
          }}
        />
      </Stack.Navigator>
    );
  }
}
