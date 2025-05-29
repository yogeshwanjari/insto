import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Share,
} from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from './ThemeContext'; // Import the ThemeContext

const CustomDrawer = (props) => {
  const { phoneNumber } = props;
  const { route, navigation } = props;

  // Share functionality
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'NutriMatch is a platform designed to help individuals make better dietary choices based on health goals and preferences. Try it now!',
      });
      if (result.action === Share.sharedAction) {
        // Handle shared action
      } else if (result.action === Share.dismissedAction) {
        // Handle dismissed action
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ flex: 1,paddingTop:3}}
      >
        <View style={styles.header}>
          <ImageBackground
            source={require("./assets/Nutrimatch.jpeg")}
            style={styles.imageBackground}
          >
            {/* Add any additional styling or content in the header */}
          </ImageBackground>
          {/* <Text style={styles.phoneText}>User Number: {phoneNumber}</Text> */}
        </View>

        <View style={styles.drawerContent}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Bottom Section with buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onShare}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="share-social-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Share</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("LogoutScreen")}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="exit-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 250,
    backgroundColor: '#FF6347', // Tomato color background
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom:5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
  
    justifyContent: 'flex-end',
  },
  phoneText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingBottom:30,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#F4F6F9', // Light background for the drawer items
    paddingTop:20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    padding: 20,
  },
  button: {
    backgroundColor: '#FF6347',
     // Tomato color for buttons
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
  },
  // Styling for drawer items
  drawerItem: {
    marginVertical: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  drawerItemFocused: {
    backgroundColor: '#FF6347', // Focused item background
  },
});

export default CustomDrawer;
