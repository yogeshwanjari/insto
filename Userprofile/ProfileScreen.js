import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Button, Alert, Image, TouchableOpacity, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [imageBase64, setImageBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [docId, setDocId] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();

          setDocId(userDoc.id);
          setName(userData.name || '');
          setEmail(userData.email || '');
          setAge(userData.age || '');
          setPhoneNumber(userData.phoneNumber || '');
          setImageUri(userData.profileImage || '');
        }
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []);

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const source = response.assets[0];
        setImageUri(source.uri);
        setImageBase64(source.base64);
      }
    });
  };

  const saveProfile = async () => {
    if (!name || !email || !age || !phoneNumber) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setLoading(true);

    try {
      const newDocRef = firestore().collection('users').doc();
      const userProfile = {
        name,
        email,
        age,
        phoneNumber,
        profileImage: imageUri || '',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      await newDocRef.set(userProfile);
      setDocId(newDocRef.id);

      Alert.alert('Profile Saved', 'Your profile has been saved successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error saving profile: ', error);
      Alert.alert('Error', 'There was an issue saving your profile');
    }
  };

  const updateProfile = async () => {
    if (!docId) {
      Alert.alert('Error', 'No profile to update');
      return;
    }

    if (!name || !email || !age || !phoneNumber) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    setLoading(true);

    try {
      const updatedProfile = {
        name,
        email,
        age,
        phoneNumber,
        profileImage: imageUri || '',
        updatedAt: firestore.FieldValue.serverTimestamp(),
      };

      await firestore().collection('users').doc(docId).update(updatedProfile);

      Alert.alert('Profile Updated', 'Your profile has been updated successfully!');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'There was an issue updating your profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={selectImage}>
          <View style={styles.imageContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.imageText}>Upload Image</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholderTextColor="#888"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={saveProfile}
          disabled={loading || !!docId}
        >
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={updateProfile}
          disabled={loading || !docId}
        >
          <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: '#f7f7f7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#aaa',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
