import { Video } from 'expo-av';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useIsFocused } from '@react-navigation/native';


export const ReelsComponent = forwardRef(({ videoUri }, parentRef) => {
    const isFocused = useIsFocused();
    const ref = useRef(null)
    useImperativeHandle(parentRef, () => ({
        play,
        unload,
        stop,
        pause
    }))

    useEffect(() => {
        return () =>
            unload();
    }, [])


    const play = async () => {
        console.log("play function working")
        if (ref.current == null) {
            return;
        }
        const status = await ref.current.getStatusAsync()
        if (status?.isPlaying) {
            return;
        }
        try {
            await ref.current.playAsync();
        } catch (e) {
            console.log(e);
        }
    }

    const stop = async () => {
        console.log("stop function working")
        if (ref.current == null) {
            return;
        }
        const status = await ref.current.getStatusAsync()
        if (!status?.isPlaying) {
            return;
        }
        try {
            await ref.current.stopAsync();
        } catch (e) {
            console.log(e);
        }
    }

    const unload = async () => {
        console.log("unload working")
        if (ref.current == null) {
            return;
        }
        try {
            await ref.current.unloadAsync();
        } catch (e) {
            console.log(e);
        }
    }

    const pause = async () => {
        console.log("pause function working");
        if (ref.current == null) {
          return;
        }
        const status = await ref.current.getStatusAsync();
        if (!status?.isPlaying) {
          return;
        }
        try {
          await ref.current.pauseAsync();
        } catch (e) {
          console.log(e);
        }
      };



    return (
        <Video
            ref={ref}
            style={styles.container}
            resizeMode='cover'
            shouldPlay={false}
            isLooping
            isMuted={!isFocused}
            source={{ uri: `https://d1a7ha9naxjmi1.cloudfront.net/public/${videoUri}.mp4` }}
        />
    )
})



const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ReelsComponent