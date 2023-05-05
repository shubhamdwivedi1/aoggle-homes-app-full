import React, { useState, useRef,useEffect } from 'react';
import { FlatList, StyleSheet, View, Image, TouchableOpacity, Modal, Text } from 'react-native';
import { Video } from 'expo-av';
import Icon from "react-native-vector-icons/Feather";


const renderItem = ({ item, setSelectedVideo, modalVisible, setModalVisible, selectedVideo }) => {
  console.log("item is",item)
  console.log("selected video is ",selectedVideo);
  return (
    <View style={styles.postContainer}>
      <TouchableOpacity style={styles.postImage} onPress={() => {
        // setSelectedVideo(item);
        // setModalVisible(true);
      }}>
        <Video
          style={styles.postImage}
          source={{ uri: `https://d1a7ha9naxjmi1.cloudfront.net/public/${item}.mp4` }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* <Modal visible={modalVisible} transparent={true}>
        <View style={styles.view}>
          <Video
            source={{ uri: `https://dunhl2btg7wz4.cloudfront.net/public/${selectedVideo}.mp4` }}
            resizeMode="cover"
            style={styles.modalVideo}
            shouldPlay={true}
            isLooping={true}
          />
        </View>
        <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(!modalVisible)}>
          <Icon name="arrow-left" style={styles.icon1}></Icon>
        </TouchableOpacity>
      </Modal> */}
    </View>
  )
};

const InstagramProfile = ({ postIds }) => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <FlatList
      data={postIds}
      keyExtractor={item => item.id}
      renderItem={({ item }) =>
        renderItem({ item, setSelectedVideo, modalVisible, setModalVisible, selectedVideo })}
      numColumns={3}
      contentContainerStyle={styles.listContainer}
    />
  )
};

const styles = StyleSheet.create({
  listContainer: {
    // paddingHorizontal: 5,
  },
  postContainer: {
    flex: 1,
    aspectRatio: 1,
    marginTop: 0,
    margin: 3,
  },
  postImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: 20,
    marginLeft: 20
  },
  modalVideo: {
    width: '100%',
    height: '100%',
  },
  view: {
    flex: 1,
    height: 400,
    width: "100%",
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon1: {
    color: "white",
    fontSize: 32,
    height: 33
  }
});

export default InstagramProfile;
