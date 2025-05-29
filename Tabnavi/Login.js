import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import SplashScreen from 'react-native-splash-screen';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [otpLoading, setOtpLoading] = useState(false); // OTP verification loading
  const navigation = useNavigation();

  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDetails = await AsyncStorage.getItem('userDetails');
        if (userDetails) {
          navigation.replace('DrawerNavigator'); // Directly navigate if logged in
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setLoading(false); // Stop showing activity indicator
      }
    };

    SplashScreen.hide(); // Hide splash screen
    checkLoginStatus();
  }, [navigation]);

  const sendOtp = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }
    setOtpLoading(true); // Start OTP loading
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'A verification code has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setOtpLoading(false); // Stop OTP loading
    }
  };

  const confirmOtp = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter the verification code.');
      return;
    }
    setOtpLoading(true); // Start OTP loading
    try {
      await confirm.confirm(verificationCode);
      const user = auth().currentUser;

      if (user) {
        const userDetails = {
          uid: user.uid,
          phoneNumber: user.phoneNumber || phoneNumber,
        };

        // Store user details in AsyncStorage
        await AsyncStorage.setItem('userDetails', JSON.stringify(userDetails));

        Alert.alert('Success', 'You are now logged in!');
        navigation.replace('DrawerNavigator', { phoneNumber });
      } else {
        Alert.alert('Error', 'Unable to fetch user details. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid verification code.');
    } finally {
      setOtpLoading(false); // Stop OTP loading
    }
  };

  if (loading) {
    // Show a loading indicator while checking login status
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Checking login status...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.header}>
        <Image
          source={require('../assets/meta.gif')}
          style={styles.logo}
        />
      </View>

      <Text style={styles.title}>NutriMatch</Text>
      <Text style={{ textAlign: 'center' }}>Verification code: 123456</Text>

      {!confirm ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Phone Number (e.g., +917030747368)"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendOtp}
            disabled={otpLoading}
          >
            {otpLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Verification Code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={confirmOtp}
            disabled={otpLoading}
          >
            {otpLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
});

export default Login;
