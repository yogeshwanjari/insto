import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const fetchPermissionsAndVideos = async () => {
      const hasPermission = await requestStoragePermission();
      if (hasPermission) {
        const videoPaths = await getVideosFromStorage();
        setVideos(videoPaths);
      } else {
        console.error('Storage permission denied');
      }
    };

    fetchPermissionsAndVideos();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        
        if (Platform.Version >= 30) {
          // Android 11 and above, need MANAGE_EXTERNAL_STORAGE permission
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to your storage to fetch videos.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Manage External Storage permission granted');
            return true;
          } else {
            console.log('Manage External Storage permission denied');
            return false;
          }
        } else {
          // For earlier Android versions, request read external storage
          const granted = await PermissionsAndroid.request(permission);
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Read External Storage permission granted');
            return true;
          } else {
            console.log('Read External Storage permission denied');
            return false;
          }
        }
      } catch (err) {
        console.warn('Error requesting storage permission:', err);
        return false;
      }
    }
    return true; // iOS doesn't need permission
  };

  const getVideosFromStorage = async () => {
    const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov'];
    const videoPaths = [];

    // Define directories to scan
    const directories = [
      RNFS.DownloadDirectoryPath, // Downloads folder
      RNFS.ExternalStorageDirectoryPath + '/Telegram/Telegram Video', // Telegram video folder
    ];

    for (const dir of directories) {
      try {
        const files = await RNFS.readDir(dir);
        files.forEach((file) => {
          if (videoExtensions.some((ext) => file.name.endsWith(ext))) {
            videoPaths.push(file.path);
          }
        });
      } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
      }
    }

    return videoPaths;
  };

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity
      style={styles.videoItem}
      onPress={() => setSelectedVideo(item)}
    >
      <Text style={styles.videoText}>{item.split('/').pop()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {selectedVideo ? (
        <View style={styles.videoPlayerContainer}>
          <Video
            source={{ uri: selectedVideo }}
            style={styles.videoPlayer}
            controls={true}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedVideo(null)}
          >
            <Text style={styles.backButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderVideoItem}
          contentContainerStyle={styles.videoList}
          ListEmptyComponent={<Text style={styles.noVideosText}>No videos found</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoList: {
    padding: 10,
  },
  videoItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#1e1e1e',
    borderRadius: 5,
  },
  videoText: {
    color: '#fff',
  },
  noVideosText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  videoPlayerContainer: {
    flex: 1,
  },
  videoPlayer: {
    flex: 1,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
  },
});

export default App;
