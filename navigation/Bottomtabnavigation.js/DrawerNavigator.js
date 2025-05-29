import * as React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import CustomDrawer from '../../CustomDrawer.js'; // Custom Drawer component
import ProfileScreen from '../../Userprofile/ProfileScreen.js';
import Home from '../../Tabnavi/Home.js'; 
import Tabi from '../../Tabi.js'; 
import { useNavigation } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ route }) => {
  const navigation = useNavigation();
  const { phoneNumber } = route?.params || {};
  const [imageUrl, setImageUrl] = React.useState(null);

  // Fetch profile image from Firestore
  const fetchImage = async () => {
    try {
      const userSnapshot = await firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        setImageUrl(userData.profileImage || '');
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  React.useEffect(() => {
    fetchImage();
  }, [phoneNumber]);

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00C9A7', // Tomato color for header
          borderBottomWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        },
        headerTintColor: '#fff',
        headerRight: () => {
          return imageUrl ? (
            <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />
            </TouchableOpacity>
          ) : (
            <Image
              source={require('../../assets/img6.jpg')} // Default profile image
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
            />
          );
        },
        drawerStyle: {
          backgroundColor: '#FFFAF0', // Background color for drawer
          width: 250,
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} phoneNumber={phoneNumber} />}
    >
      <Drawer.Screen
        name="Details"
        options={{
          title: 'Home',
          drawerIcon: ({ focused, size }) => (
            <Ionicons
              name="navigate-circle"
              size={size}
              color={focused ? '#FF6347' : '#bbb'}
            />
          ),
        }}
      >
        {() => <Tabi phoneNumber={phoneNumber} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Homes"
        component={Home}
        initialParams={{ phoneNumber }}
        options={{
          title: 'Chatgpt_Y',
          drawerIcon: ({ focused, size }) => (
            <Ionicons name="chatbubbles" size={size} color={focused ? '#FF6347' : '#bbb'} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        initialParams={{ phoneNumber }}
        options={{
          title: 'Profile',
          drawerIcon: ({ focused, size }) => (
            <Ionicons name="person-circle" size={size} color={focused ? '#FF6347' : '#bbb'} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 15,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  headerRight: {
    marginRight: 15,
  },
  drawerLabel: {
    fontSize: 14,
    color: '#FF6347',
  },
  drawerLabelFocused: {
    fontSize: 14,
    color: '#551E18',
    fontWeight: '500',
  },
  drawerItem: {
    height: 50,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  drawerItemFocused: {
    backgroundColor: '#FF6347', // Background color when focused
  },
  drawerItemText: {
    color: '#555',
    fontSize: 16,
  },
});

export default DrawerNavigator;
