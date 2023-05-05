import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, ScrollView } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
// import Onboarding,{ DoneButton } from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
function OnboardingPage() {
    const slides = [
        {
            key: "1",
            title: 'Create',
            text: 'Creare and publish your videos through tiktok.',
            image: require('./OnBoardImages/slide1png.png'),
            backgroundColor: '#59b2ab',
        },
        {
            key: "2",
            title: 'Explore',
            text: 'Explore the stufs as an anonymous.',
            image: require('./OnBoardImages/slide2png.png'),
            backgroundColor: '#59b2ab',
        },
        {
            key: "3",
            title: "Let's get started",
            text: 'Get ready to use the app',
            image: require('./OnBoardImages/slide3png.png'),
            backgroundColor: '#59b2ab',
        },
    ]
    const handleDone = async () => {
        await AsyncStorage.setItem("onboard-done", "true");
        console.log("all done")
    }

    const renderSlide = ({ item }) => {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{item.title}</Text>
                <Image style={styles.imageStyle} source={item.image} />
                <Text style={styles.imageText}>{item.text}</Text>
            </View>
        )
    }
    return (
        <ScrollView>
            <View style={styles.slide}>
                <AppIntroSlider
                    style={styles.slide}
                    data={slides}
                    renderItem={renderSlide}
                    showSkipButton={true}
                    onDone={()=>{handleDone()}}
                    onSkip={()=>{handleDone()}}
                />
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: '50%',
        height: '50%',
        aspectRatio: 1,
        borderRadius: 20,
        marginLeft: 26,
        marginTop: 100,
    },
    slide: {
        backgroundColor: '#e9bcbe'
    },
    title: {
        color: 'white',
        fontSize: 35,
        textAlign: 'center',
        marginTop:23
    },
    imageText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30
    },
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2,
    }
});


export default OnboardingPage
