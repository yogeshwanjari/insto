import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const LogoutScreen = () => {
  const [userDetails, setUserDetails] = useState(null); // State to hold user details
  const navigation = useNavigation();

  // Fetch user details from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await AsyncStorage.getItem('userDetails');
      if (user) {
        setUserDetails(JSON.parse(user)); // Parse and set user details
      }
    };
    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: logout, // Proceed with logout if user confirms
        },
      ],
      { cancelable: true }
    );
  };

  const logout = async () => {
    try {
      await auth().signOut(); // Sign out from Firebase
      await AsyncStorage.removeItem('userDetails'); // Clear user details from AsyncStorage
      Alert.alert('Success', 'You have been logged out.');
      navigation.replace('Login'); // Navigate back to login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {userDetails ? (
        <Text style={styles.userDetails}>
          Logged in as: {userDetails.phoneNumber}
        </Text>
      ) : (
        <Text style={styles.userDetails}>
          Fetching user details...
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  userDetails: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default LogoutScreen;
