import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView,BackHandler,Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Swiper from 'react-native-swiper';
import GeminiChat from '../Screens/GeminiChat';
import { Ionicons } from 'react-native-vector-icons'; // For using icons

const Home = () => {
  const [profileImage, setProfileImage] = useState('');

  // Fetch the profile image from Firestore (if needed)
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const userSnapshot = await firestore()
          .collection('users')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!userSnapshot.empty) {
          const userDoc = userSnapshot.docs[0];
          const userData = userDoc.data();
          setProfileImage(userData.profileImage || '');
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, []);


  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Hold on!",
        "Are you sure you want to exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "YES",
            onPress: () => BackHandler.exitApp(),
          },
        ]
      );
      return true; // Prevent the default behavior
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup the listener
  }, []);




  return (
    <ImageBackground
      source={require('../assets/img8.jpg')}
      resizeMode="cover"
      style={styles.image}
    >
      <ScrollView style={{ flex: 1 }}>

        {/* Swiper Section with Gradient Backgrounds */}
        <Swiper autoplay={true} style={styles.wrapper} dotColor="#FFD700" activeDotColor="#FF6347" loop={true}>
          {/* Slide 1 */}
          <View style={[styles.slide, { backgroundColor: '#FF7F50' }]}>
            <Image source={require('../assets/Nutrimatch.jpeg')} style={styles.slideImage} />
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText}>NutriMatch - Best Match for Your Health</Text>
            </View>
          </View>
          {/* Slide 2 */}
          <View style={[styles.slide, { backgroundColor: '#8A2BE2' }]}>
            <Image source={require('../assets/img3.jpg')} style={styles.slideImage} />
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText}>Explore New Recipes</Text>
            </View>
          </View>
          {/* Slide 3 */}
          <View style={[styles.slide, { backgroundColor: '#00BFFF' }]}>
            <Image source={require('../assets/img5.jpg')} style={styles.slideImage} />
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText}>Healthy Living Starts Here</Text>
            </View>
          </View>
          {/* Slide 4 */}
          <View style={[styles.slide, { backgroundColor: '#32CD32' }]}>
            <Image source={require('../assets/img6.jpg')} style={styles.slideImage} />
            <View style={styles.textOverlay}>
              <Text style={styles.overlayText}>Stay Active, Stay Healthy</Text>
            </View>
          </View>
        </Swiper>

        {/* Gemini Chat Section */}
        
        <ScrollView>
          <GeminiChat />
        </ScrollView>
      </ScrollView>
       
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    height: 230,
    borderRadius: 15,
    borderWidth: 1,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  textOverlay: {
    position: 'absolute',
    top: '40%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 10,
    borderRadius: 10,
    opacity: 0.8,
  },
  overlayText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dotStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // White dot
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  activeDotStyle: {
    backgroundColor: '#FF6347', // Red for active dot
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default Home;
