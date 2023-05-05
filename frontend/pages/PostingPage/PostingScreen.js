import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from 'axios';
import * as Location from 'expo-location';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from "jwt-decode";
import { Amplify, Storage } from 'aws-amplify';
import awsconfig from '.././../src/aws-exports';
import SuccessScreen from "../SuccessPage/SuccessScreen";
Amplify.configure(awsconfig);

function PostingScreen({ videoData, postingPageCancel, videoUri }) {
  console.log("video data is          ",videoData)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [videoName, setVideoName] = useState(null);
  const thumbnailUri = videoData.assets[0].uri + "#t=0.5";
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [guest, setGuest] = useState(false)

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("app-token");
        const guestUser = await AsyncStorage.getItem("app-guest");
        const userData = await AsyncStorage.getItem("app-userData")
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            // Token has expired
            await AsyncStorage.removeItem("token");
            setLoggedIn(false);
          } else {
            // Token is still valid
            setLoggedIn(true);
            setUserData(userData);
            setGuest(false)
          }
        } if (!token) {
          setLoggedIn(false);
        }
        if (guestUser) {
          setGuest(true)
          setLoggedIn(false);
        } if (!guestUser) {
          setGuest(false)
        }
      } catch (error) {
        console.log('Error checking user data:', error);
      }
    }
    checkUserData()
  }, []);





  const fetchImageUri = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  }


  const uploadFile = async (videoData) => {
    setIsUploading(true);
    const img = await fetchImageUri(videoData.assets[0].uri)
    console.log("uploadFile function working ", videoData,"    ")
    return Storage.put(`${videoName}.mp4`, img, {
      level: 'public',
      contentType: videoData.assets[0].type,
      progressCallback(uploadProgress) {
        const percentUploaded = Math.round((uploadProgress.loaded / uploadProgress.total) * 100);
        setUploadPercentage(percentUploaded)
        console.log('Progress == ', uploadProgress.loaded + '/' + uploadProgress.total);
      }
    }).then((responce) => {
      Storage.get(responce.key).then((result) => {
        console.log("result == ", result)
        if (result) {
          setFileUploaded(true)
        }
      }).catch(e => {
        console.log(e)
      })
    }).catch((error) => {
      console.log(error)
    }).finally(() => {
      setIsUploading(false);
    })
  }


  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      }
    }

    getLocation();
  }, []);


  const getLocation = async () => {
    if (currentLocation === null) {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      } else {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      }
    }
  }



  useEffect(() => {
    if (videoName != null) {
      console.log("posting video")
      console.log(videoUri)
      uploadFile(videoData)
    }
  }, [videoName])


  const postVideo = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    const postData = {
      videoData: videoData,
      currentLocation: currentLocation,
      formattedDate: formattedDate,
      userData: userData
    }
    if (!loggedIn) {
      Toast.show(`Please login before trying to post.`, Toast.LONG, ['UIAlertController']);
      return null
    }
    if(videoData.assets[0].duration > 30000 ){
      Toast.show(`Maximum video duration is 30 sec.`, Toast.LONG, ['UIAlertController']);
      return null
    }
    if (currentLocation === null) {
      getLocation()
    } else {
      await axios.post('http://192.168.1.2:3000/post/video-post/post-video', postData).then((responce) => {
        console.log(responce.data.id)
        if (responce.data.status === 'success') {
          setVideoName(responce.data.id)
        } else {
          Toast.show(`${responce.data.message}`, Toast.LONG, ['UIAlertController']);
          return null
        }
      })
    }
  }

  return (
    <View style={styles.container}>
      {!fileUploaded ?
        <>
          <View style={styles.rect}>
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnail} />
          </View>
          <TouchableOpacity style={styles.button} onPress={postVideo}>
            <Text style={styles.share}>SHARE</Text>
          </TouchableOpacity>
          <Icon name="arrow-left" style={styles.icon1}></Icon>
          <TouchableOpacity style={styles.button2} onPress={postingPageCancel}>
            <Text style={styles.cancel}>CANCEL</Text>
          </TouchableOpacity>
          <Spinner
            visible={isUploading}
            textContent={`${uploadPercentage}%`}
            textStyle={{ color: '#fff' }}
            animation="fade"
            color="rgba(251,248,248,1"
            size="large"
            overlayColor="rgba(0, 0, 0, 0.5)"
            overlayOpacity={1}
          />
        </> : <SuccessScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect: {
    width: 348,
    height: 244,
    backgroundColor: "#E6E6E6",
    marginTop: 130,
    alignSelf: "center"
  },
  button: {
    width: 348,
    height: 44,
    backgroundColor: "#f93e3e",
    flexDirection: "row",
    borderRadius: 11,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.27,
    shadowRadius: 0,
    marginTop: 312,
    marginLeft: 14
  },
  rect2: {
    flex: 0.5,
    backgroundColor: "rgba(240, 240, 240,1)",
    margin: 100
  },
  rect3: {
    flex: 0.5,
    backgroundColor: "rgba(253, 253, 253,1)",
    margin: 100
  },
  share: {
    top: 10,
    left: 139,
    position: "absolute",
    // fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 1
  },
  icon1: {
    color: "rgba(128,128,128,1)",
    fontSize: 32,
    marginTop: -681,
    marginLeft: 14
  },
  button2: {
    width: 348,
    height: 36,
    backgroundColor: "rgba(239,236,236,1)",
    borderWidth: 0,
    borderColor: "#000000",
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.14,
    shadowRadius: 0,
    borderRadius: 9,
    overflow: "hidden",
    marginTop: 543,
    marginLeft: 14
  },
  cancel: {
    // fontFamily: "roboto-700",
    color: "#f73b3b",
    height: 18,
    width: 62,
    textAlign: "center",
    fontSize: 16,
    marginTop: 9,
    marginLeft: 142
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  progressBar: {
    marginTop: 20,
  }
});

export default PostingScreen;
