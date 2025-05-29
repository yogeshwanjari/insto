import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from './Tabnavi/Home';
import Detals from './Tabnavi/Detals';
import DragDrop from './DragVideos/DragDrop';

const Tab = createMaterialBottomTabNavigator();

function Tabi() {
  const iconSize = new Animated.Value(1); // Animation scale for icons
  const backgroundColor = new Animated.Value(0); // Animated background color

  const animateIcon = (focused) => {
    Animated.timing(iconSize, {
      toValue: focused ? 1.2 : 1, // Scale up the icon when focused
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const animateBackgroundColor = (focused) => {
    Animated.timing(backgroundColor, {
      toValue: focused ? 1 : 0, // Change background color when focused
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false, // Cannot use native driver for background color
    }).start();
  };

  // Interpolate background color from 0 to 1 to generate a smooth color change
  const backgroundColorInterpolate = backgroundColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#00C9A7', '#006F5F'], // Teal to darker teal gradient
  });

  // Glowing icon effect when focused
  const glowEffect = (focused) => {
    return {
      shadowColor: focused ? 'yellow' : 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: focused ? 10 : 0,
      elevation: focused ? 5 : 0,
    };
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      inactiveColor="#FF6347" // Tomato color for inactive icons
      barStyle={{
        backgroundColor: backgroundColorInterpolate,
        height: 60,
        paddingBottom: 5,
        borderRadius: 15,
        borderTopLeftRadius: 30, // Rounded top corners
        borderTopRightRadius: 30,
      }}
      labeled={false} // Hide labels, show only icons
      shifting={true}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            animateIcon(focused);
            return (
              <Animated.View
                style={[
                  { transform: [{ scale: iconSize }] },
                  glowEffect(focused), // Apply glow effect
                ]}
              >
                <MaterialCommunityIcons
                  name="home"
                  color={focused ? '#FFD700' : 'white'} // Gold color when active
                  size={30}
                />
              </Animated.View>
            );
          },
          tabBarLabel: 'Home',
          tabBarOnPress: () => animateBackgroundColor(true),
        }}
      />

      <Tab.Screen
        name="Notification"
        component={Detals}
        options={{
          tabBarIcon: ({ focused }) => {
            animateIcon(focused);
            return (
              <Animated.View
                style={[
                  { transform: [{ scale: iconSize }] },
                  glowEffect(focused), // Apply glow effect
                ]}
              >
                <MaterialCommunityIcons
                  name="bell"
                  color={focused ? '#FFD700' : 'white'} // Gold color when active
                  size={30}
                />
              </Animated.View>
            );
          },
          tabBarLabel: 'Notification',
          tabBarOnPress: () => animateBackgroundColor(true),
        }}
      />

      <Tab.Screen
        name="ShortVideos"
        component={DragDrop}
        options={{
          tabBarIcon: ({ focused }) => {
            animateIcon(focused);
            return (
              <Animated.View
                style={[
                  { transform: [{ scale: iconSize }] },
                  glowEffect(focused), // Apply glow effect
                ]}
              >
                <MaterialCommunityIcons
                  name="play-box-multiple"
                  color={focused ? '#FFD700' : 'white'} // Gold color when active
                  size={30}
                />
              </Animated.View>
            );
          },
          tabBarLabel: 'ShortVideos',
          tabBarOnPress: () => animateBackgroundColor(true),
        }}
      />
    </Tab.Navigator>
  );
}

export default Tabi;
