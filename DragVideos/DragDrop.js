import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";

import YouTubeIframe from "react-native-youtube-iframe";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";

const DragDrop = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoDetails, setVideoDetails] = useState({});
  const [numColumns, setNumColumns] = useState(2);

  const videos = [
    { id: "0fz1O1UQ-90", title: "Epic Travel Video", description: "Explore breathtaking destinations.", thumbnail: "https://img.youtube.com/vi/0fz1O1UQ-90/0.jpg" },
    { id: "dQw4w9WgXcQ", title: "Rickroll Video", description: "A classic internet sensation.", thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg" },
    { id: "M7lc1UVf-VE", title: "Google I/O 2018 Keynote", description: "Insights from Google’s 2018 keynote.", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/0.jpg" },
    { id: "LrNr-Qf1g5g", title: "Nature's Beauty", description: "Dive into the wonders of nature.", thumbnail: "https://img.youtube.com/vi/LrNr-Qf1g5g/0.jpg" },
    { id: "tgbNymZ7vqY", title: "A Cool Music Video", description: "Listen to some soothing beats.", thumbnail: "https://img.youtube.com/vi/tgbNymZ7vqY/0.jpg" },
    { id: "kJQP7kiw5Fk", title: "Despacito", description: "The global music phenomenon.", thumbnail: "https://img.youtube.com/vi/kJQP7kiw5Fk/0.jpg" },
    { id: "y6120QOlsfU", title: "Yankee Doodle", description: "A fun and quirky video to watch.", thumbnail: "https://img.youtube.com/vi/y6120QOlsfU/0.jpg" },
    { id: "P0HIdd5YlXg", title: "Mountain Views", description: "Relax with serene mountain landscapes.", thumbnail: "https://img.youtube.com/vi/P0HIdd5YlXg/0.jpg" },
    { id: "J---aiyznGQ", title: "Sample Video", description: "A demonstration of creative ideas.", thumbnail: "https://img.youtube.com/vi/J---aiyznGQ/0.jpg" },
    { id: "pLQj-__V3mQ", title: "Programming Tips", description: "Learn quick coding tricks.", thumbnail: "https://img.youtube.com/vi/pLQj-__V3mQ/0.jpg" },
    { id: "R5i8tjLj6rI", title: "Space Exploration", description: "Discover the mysteries of the universe.", thumbnail: "https://img.youtube.com/vi/R5i8tjLj6rI/0.jpg" },
    { id: "3JZ_D3ELwOQ", title: "Motivational Speech", description: "Get inspired to achieve greatness.", thumbnail: "https://img.youtube.com/vi/3JZ_D3ELwOQ/0.jpg" },
    { id: "yPbUKDtvwjI", title: "Art Masterclass", description: "Learn the secrets of painting.", thumbnail: "https://img.youtube.com/vi/yPbUKDtvwjI/0.jpg" },
    { id: "HXV3zeQKqGY", title: "DIY Crafts", description: "Fun craft ideas for all ages.", thumbnail: "https://img.youtube.com/vi/HXV3zeQKqGY/0.jpg" },
    { id: "60ItHLz5WEA", title: "Cooking Mastery", description: "Tips to master your culinary skills.", thumbnail: "https://img.youtube.com/vi/60ItHLz5WEA/0.jpg" },
    { id: "FlsCjmMhFmw", title: "Workout Routine", description: "Boost your fitness with this routine.", thumbnail: "https://img.youtube.com/vi/FlsCjmMhFmw/0.jpg" },
    { id: "u2py6d0lZf4", title: "Pet Adventures", description: "Adorable moments with pets.", thumbnail: "https://img.youtube.com/vi/u2py6d0lZf4/0.jpg" },
    { id: "EwTZ2xpQwpA", title: "Memorable Events", description: "Highlights from global events.", thumbnail: "https://img.youtube.com/vi/EwTZ2xpQwpA/0.jpg" },
    { id: "hTWKbfoikeg", title: "Rock Music Hits", description: "Enjoy some classic rock anthems.", thumbnail: "https://img.youtube.com/vi/hTWKbfoikeg/0.jpg" },
    { id: "9bZkp7q19f0", title: "Gangnam Style", description: "The viral dance hit that took the world by storm.", thumbnail: "https://img.youtube.com/vi/9bZkp7q19f0/0.jpg" },
    { id: "CevxZvSJLk8", title: "Nature Documentary", description: "Explore the wild like never before.", thumbnail: "https://img.youtube.com/vi/CevxZvSJLk8/0.jpg" },
    { id: "YbJOTdZBX1g", title: "Dance Choreography", description: "Mesmerizing dance performances.", thumbnail: "https://img.youtube.com/vi/YbJOTdZBX1g/0.jpg" },
    { id: "xVtFr7hvs5g", title: "Life Hacks", description: "Simplify your life with these hacks.", thumbnail: "https://img.youtube.com/vi/xVtFr7hvs5g/0.jpg" },
    { id: "uJ_1HMAGb4k", title: "Ocean Wonders", description: "Dive deep into the beauty of oceans.", thumbnail: "https://img.youtube.com/vi/uJ_1HMAGb4k/0.jpg" },
    { id: "nVjsGKrE6E8", title: "Music Therapy", description: "Relax and rejuvenate with calming tunes.", thumbnail: "https://img.youtube.com/vi/nVjsGKrE6E8/0.jpg" },
    { id: "8ZcmTl_1ER8", title: "Tech Unboxing", description: "Reviewing the latest gadgets.", thumbnail: "https://img.youtube.com/vi/8ZcmTl_1ER8/0.jpg" },
    { id: "6_b7RDuLwcI", title: "Drone Footage", description: "Stunning aerial views captured by drones.", thumbnail: "https://img.youtube.com/vi/6_b7RDuLwcI/0.jpg" },
    { id: "e-ORhEE9VVg", title: "Pop Music Video", description: "Enjoy the latest pop music trends.", thumbnail: "https://img.youtube.com/vi/e-ORhEE9VVg/0.jpg" },
    { id: "1y6smkh6c-0", title: "Sports Highlights", description: "Top moments from your favorite sports.", thumbnail: "https://img.youtube.com/vi/1y6smkh6c-0/0.jpg" },
    { id: "CJinWua98NA", title: "Fashion Trends", description: "Discover the latest in fashion.", thumbnail: "https://img.youtube.com/vi/CJinWua98NA/0.jpg" },
  ];

  const toggleModal = () => setModalVisible(!isModalVisible);

  const onVideoSelect = (video) => {
    setVideoDetails(video);
    setLoading(true);
    toggleModal();
  };

  return (
    <View style={styles.container}>
      <FlatList
        key={numColumns}
        data={videos}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={700}
            delay={200}
            style={styles.videoItem}
          >
            <TouchableOpacity
              style={styles.videoContent}
              onPress={() => onVideoSelect(item)}
            >
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.playButtonContainer}>
                <Icon name="play-circle-outline" size={50} color="#FFF" />
              </View>
              <Text style={styles.videoTitle}>{item.title}</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide" onRequestClose={toggleModal}>
        <View style={styles.fullscreenModal}>
          {loading && <ActivityIndicator size="large" color="#FF6347" />}
          <YouTubeIframe
            videoId={videoDetails.id}
            play={true}
            height={Dimensions.get("window").height * 0.4}
            width="100%"
            onReady={() => setLoading(false)}
            onError={(error) => {
              console.error("Error loading video: ", error);
              setLoading(false);
            }}
            onEnd={() => setModalVisible(false)}
          />
          <ScrollView 
          style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              <Icon name="video" size={24} color="#FF6347" /> {videoDetails.title}
            </Text>
            <Text style={styles.modalDescription}>
              <Icon name="information-outline" size={20} color="#FF6347" /> {videoDetails.description}
            </Text>
          </ScrollView>
          <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
            <Icon name="close-circle" size={50} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    paddingTop: 20,
  },
  videoItem: {
    margin: 10,
    padding: 0,
    width: "45%",
  },
  videoContent: {
    alignItems: "center",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  playButtonContainer: {
    position: "absolute",
    top: "35%",
    left: "35%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    padding: 20,
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  modalTitle: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 18,
    color: "#BBB",
    marginTop: 10,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
  },
});

export default DragDrop;
