import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator} from 'react-native';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import messaging from '@react-native-firebase/messaging';

const Detals = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Simulate random notifications in case no response is received
  const getRandomNotifications = () => {
    const randomNotifications = [
      { id: '1', title: 'New Message', body: 'You have a new message from John!' },
      { id: '2', title: 'New Follower', body: 'Someone just followed you!' },
      { id: '3', title: 'App Update', body: 'A new update is available for the app.' },
      { id: '4', title: 'Event Reminder', body: 'Don’t forget your meeting at 3:00 PM today.' },
      { id: '5', title: 'Offer Alert', body: 'Huge discounts are available on your favorite items!' },
    ];
    return randomNotifications;
  };

  // Function to handle Firebase message background notification
  const onMessageReceived = (remoteMessage:FirebaseMessagingTypes.RemoteMessage) => {
    console.log('Notification received in foreground:', remoteMessage);
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        id: remoteMessage.messageId,
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
      },
    ]);
  };

  // Request for permission and subscribe to FCM
  useEffect(() => {
    const requestPermission = async () => {
      const authorizationStatus = await messaging().requestPermission();
      if (
        authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('FCM permission granted');
      }
    };

    const getInitialNotification = async () => {
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          {
            id: initialNotification.messageId,
            title: initialNotification.notification.title,
            body: initialNotification.notification.body,
          },
        ]);
      }
    };

    const unsubscribe = messaging().onMessage(onMessageReceived);

    requestPermission();
    getInitialNotification();

    // Simulate random notifications after 3 seconds if no notification from FCM
    setTimeout(() => {
      if (notifications.length === 0) {
        const randomNotifications = getRandomNotifications();
        setNotifications(randomNotifications);
      }
      setLoading(false); // Stop loading once data is fetched
    }, 3000);

    return unsubscribe;
  }, [notifications]);


  
  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationBody}>{item.body}</Text>
    </View>
  );

  if (loading) {
    // Display Activity Indicator while loading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container} // Apply the container styles to the list content
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F4F6FC', // Light gradient background color
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5, // Adding shadow for better appearance
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2', // Vibrant blue color for titles
    marginBottom: 10,
  },
  notificationBody: {
    fontSize: 16,
    color: '#444', // Subtle gray for the body text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6FC',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4A90E2',
  },
});

export default Detals;
