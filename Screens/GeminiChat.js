import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Animated,
  RefreshControl,
} from 'react-native';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Octicons from 'react-native-vector-icons/Octicons';
import firestore from '@react-native-firebase/firestore'; // Add this for Firestore

const API_KEY = 'AIzaSyBsSvLUsFiJQ97_w3uW6hOOCCW1WWFNPpg';
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiChat({ handleBackPress }) {
  const scrollRef = useRef();
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(''); // State to hold fetched name
  const [age, setAge] = useState(''); // State to hold fetched age
  const [isFetchingUserData, setIsFetchingUserData] = useState(true); // New state for fetching user data
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchUserData = async () => {
    try {
      setIsFetchingUserData(true);
      const userSnapshot = await firestore()
        .collection('users')
        .orderBy('createdAt', 'desc')
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        setName(userData.name || 'Unknown'); // Fetch and set the name
        setAge(userData.age || 'N/A'); // Fetch and set the age
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsFetchingUserData(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  const handleSend = async () => {
    try {
      setLoading(true);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const chat = model.startChat();
      const result = await chat.sendMessage(query);
      const response = result.response;
      if (response) {
        const text = await response?.text();
        const newQuestion = { question: query, answer: text };
        setMessages([...messages, newQuestion]);
        fadeIn();
        scrollRef.current?.scrollToEnd({ animated: true });
      }
      setQuery('');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setQuery('');
      Alert.alert('Error', err.message || 'Something went wrong.');
    }
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Display Name and Activity Indicator */}
      <View style={styles.userInfoContainer}>
        {isFetchingUserData ? (
          <ActivityIndicator size="small" color="blue" />
        ) : (
          <Text style={styles.userInfoText}>Welcome, {name}</Text>
        )}
      </View>

      {/* Messages Section */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1E90FF']}
          />
        }>
        {messages.map((msg, index) => (
          <Animated.View key={index} style={[styles.messageWrapper, { opacity: fadeAnim }]}>
            <View style={styles.questionBubble}>
              <Text style={styles.bubbleText}>{msg.question}</Text>
            </View>
            <View style={styles.answerBubble}>
              <Text style={styles.bubbleText}>{msg.answer}</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      {/* Input Section */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="GPT - search ingredient and anything you want"
          placeholderTextColor="#aaa"
          multiline
          editable={!loading}
          value={query}
          onChangeText={(text) => setQuery(text)}
        />
        {loading ? (
          <View style={styles.sendButton}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Octicons name="search" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  userInfoContainer: {
    padding: 15,
    backgroundColor: '#f5f7fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  userInfoText: {
    fontSize: 16,
    color: 'blue',
    fontWeight: 'bold',
  },
  scrollView: {
    padding: 15,
  },
  messageWrapper: {
    marginVertical: 10,
  },
  questionBubble: {
    alignSelf: 'flex-end',
    maxWidth: '75%',
    padding: 10,
    backgroundColor: '#62c2bb',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  answerBubble: {
    alignSelf: 'flex-start',
    maxWidth: '75%',
    padding: 10,
    backgroundColor: '#207db2',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  bubbleText: {
    color: '#fff',
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    margin: 5,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    elevation: 5,
  },
});
