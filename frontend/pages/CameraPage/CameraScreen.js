import React, { useRef, useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import EntypoIcon from "react-native-vector-icons/Entypo";
import FeatherIcon from "react-native-vector-icons/Feather";
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker'
import PostingScreen from '../PostingPage/PostingScreen';



const { width, height } = Dimensions.get('window');

function CameraScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.front)
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [recording, setRecording] = useState(false);
    const [videoUri, setVideoUri] = useState(null);
    const [videoData, setVideoData] = useState(null)
    const cameraRef = useRef(null);
    const [timer, setTimer] = useState(0);
    const [postingPage, setPostingPage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    const options = {
        mediaType: 'photo',
        quality: 0.8
    };

    const [hasGalleryPermissions, setHasGalleryPermissions] = useState(false)

    const [galleryItems, setGalleryItems] = useState([])
    const navigation = useNavigation();
    const handleBackPress = () => {
        navigation.navigate('Home');
      return true;
    };
    useBackHandler(handleBackPress);


    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
            setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');

            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync()
            setHasGalleryPermissions(galleryStatus.status == 'granted')

            if (galleryStatus.status == 'granted') {
                const userGalleryMedia = await MediaLibrary.getAssetsAsync({ sortBy: ['creationTime'], mediaType: ['video'] })
                setGalleryItems(userGalleryMedia.assets)
            }
        })();
    }, []);

    useEffect(() => {
        let interval = null;
        if (recording) {
            interval = setInterval(() => {
                setTimer(timer => timer + 1);
            }, 1000);
        } else {
            clearInterval(interval);
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [recording]);

    const handleRecordVideo = async () => {
        if (cameraRef.current) {
            try {
                setRecording(true);
                const videoRecordPromise = cameraRef.current.recordAsync({ maxDuration: 30 });
                const data = await videoRecordPromise;
                if (hasMediaLibraryPermission) {
                    await MediaLibrary.saveToLibraryAsync(data.uri);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setRecording(false);
            }
        }
    };

    const handleStopRecording = () => {
        cameraRef.current.stopRecording();
        setRecording(false)
    };



    const pickFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1,
            videoExportPreset: ImagePicker.VideoExportPreset.LowQuality,
        }).catch(error => {
            console.log(error)
        })
        if (!result.canceled) {
            console.log(result)
            try {
                let fileUri = result.assets[0].uri;
                console.log('File URI:', fileUri);
                setVideoUri(fileUri);
                setVideoData(result);
            } catch (error) {
                console.log(error);
            }
        }
    }

    useEffect(() => {
        if (videoData != null) {
            setPostingPage(true)
        }
    })

    function postingPageCancel() {
        setVideoData(null)
        setPostingPage(false);
    }

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.mainContainer}>
            {postingPage ? <PostingScreen videoData={videoData} postingPageCancel={postingPageCancel} videoUri={videoUri} /> : ""}
            {!postingPage ? <>
                <Camera style={styles.camera} type={cameraType} flashMode={flash} ref={cameraRef}></Camera>
                <View style={styles.overlay3}>
                    <FeatherIcon name="arrow-left" style={styles.icon} onPress={() => navigation.navigate('Home')}></FeatherIcon>
                </View>
                <View style={styles.overlay}>
                    <Text style={styles.timer}>{timer}s</Text>
                    <EntypoIcon name="flash" style={styles.icon} onPress={() => setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off)}></EntypoIcon>
                    <FeatherIcon name="rotate-cw" style={styles.icon} onPress={() => setCameraType(cameraType === Camera.Constants.Type ? Camera.Constants.Type.front : Camera.Constants.Type.back)}></FeatherIcon>
                </View>
                <View style={styles.overlay2}>
                    <EntypoIcon name="controller-record" style={styles.icon2} onPress={recording ? handleStopRecording : handleRecordVideo}></EntypoIcon>
                </View>

                <View style={styles.overlay5}>
                    <View>
                        <TouchableOpacity style={styles.galleryButton} onPress={() => pickFromGallery()}>
                            {galleryItems[0] == undefined ? <></> :
                                <Image style={styles.galleryButtonImage} source={{ uri: galleryItems[0].uri }} />}
                        </TouchableOpacity>
                    </View>
                </View>
            </> : ""}
        </View>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    camera: {
        width,
        height,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 300,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay2: {
        position: 'absolute',
        top: 500,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay3: {
        position: 'absolute',
        top: 0,
        bottom: 650,
        left: 0,
        right: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay4: {
        position: 'absolute',
        top: 0,
        bottom: 400,
        left: 0,
        right: 300,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay5: {
        position: 'absolute',
        top: 500,
        bottom: 0,
        left: 280,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        paddingBottom: 20,
        color: 'white',
        fontSize: 30,
        marginHorizontal: 10,
    }, icon2: {
        color: 'red',
        marginHorizontal: 10,
        fontSize: 112,
    },
    icon3: {
        paddingBottom: 10,
        color: 'red',
        fontSize: 30,
        marginHorizontal: 10,
        fontSize: 112,
    },
    timer: {
        color: 'white',
        fontSize: 30,
        marginBottom: 25
    },
    galleryButton: {
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
        width: 50,
        height: 50,
    },
    galleryButtonImage: {
        width: 50,
        height: 50,
    },
});

export default CameraScreen
