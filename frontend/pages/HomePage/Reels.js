import React, { useRef, useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList } from "react-native";
import ReelsComponent from './ReelsComponent';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/FontAwesome';
import { Linking } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import LinearGradient from 'expo-linear-gradient';
function Reels({ homeTab }) {
    const [cdnVideos, setcdnVideos] = useState([])
    const isFocused = useIsFocused();
    const mediaRefs = useRef([])
    const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)
    const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      useBackHandler(handleBackPress);

    const getPosts = async () => {
        await axios.get('http://192.168.1.2:3000/post/video-post/get-posts').then((response) => {
            setcdnVideos(response.data.response)
        }).catch((error) => {
            console.log(error)
        })
    }



    useEffect(() => {
        if(isFocused){
            getPosts()
        }
        
        return () => {
            console.log("every video stopped");
            // Stop all videos when component unmounts
            mediaRefs.current.forEach((cell) => cell && cell.stop());
        };
    }, [])


    useEffect(() => {
        const interval = setInterval(() => {
          getPosts();
        }, 1000); // adjust the interval as needed
        
        return () => {
          clearInterval(interval);
        };
      }, []);


    const onViewableItemsChanged = ({ changed }) => {
        let currentKey;
        changed.forEach((element) => {
            const cell = mediaRefs.current[element.key];
            if (cell) {
                if (element.isViewable) {
                    cell.play();
                    currentKey = element.key;
                } else {
                    cell.stop();
                }
            }
        });

        // Stop all videos except the one that is currently in view
        mediaRefs.current.forEach((cell, key) => {
            if (key !== currentKey && cell) {
                cell.stop();
            }
        });
    }




    const renderItem = ({ item, index }) => {
        return (
            <View style={[{ flex: 1, height: Dimensions.get('screen').height, width: Dimensions.get('window').width}, index % 2 == 0 ? <ShimmerPlaceholder /> : <ShimmerPlaceholder />]}>
                <ReelsComponent ref={postSingleRef => (mediaRefs.current[item] = postSingleRef)} videoUri={cdnVideos[index % cdnVideos.length]} />
                <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL('tel:8929007192')}>
                    <Icon name="call" size={30} color="blue" backgroundColor="white"/>
                </TouchableOpacity>

                <TouchableOpacity style={styles.whatsappBtn} onPress={() => Linking.openURL(`https://wa.me/8929007192?text=Hey sir i would like to discus about ${item} property.`)}>
                    <Icons name="whatsapp" size={30} color={"#32d46f"}/>
                </TouchableOpacity>
            </View>
        )
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={cdnVideos}
                windowSize={4}
                initialNumToRender={1}
                maxToRenderPerBatch={1}
                removeClippedSubviews
                snapToInterval={Dimensions.get("screen").height}
                renderItem={renderItem}
                pagingEnabled
                keyExtractor={item => item}
                decelerationRate={'fast'}
                onViewableItemsChanged={onViewableItemsChanged}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    callBtn: {
        position: "absolute",
        right: 2,
        top: "50%",
        paddingRight: 0,
        backgroundColor: "white",
        borderRadius: 50,
        width: 50,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:2,
    },
    whatsappBtn:{
        position: "absolute",
        right: 2,
        top: "58%",
        paddingRight: 0,
        backgroundColor: "white",
        borderRadius: 50,
        width: 50,
        height: 50,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:2,
    }

})

export default Reels
