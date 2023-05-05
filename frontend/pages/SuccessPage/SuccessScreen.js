import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, Button } from 'react-native';
// import { Video } from 'expo-av';
import LottieView from 'lottie-react-native';
import { BackHandler } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';

function SuccessScreen() {
    const navigation = useNavigation();
    const handleBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      useBackHandler(handleBackPress);
    return (
        <View style={styles.container}>
            <LottieView
                source={require("../../Lottie/98621-success-status.json")}
                autoPlay
                loop={true}
                style={{ width: 400, height: 400 }}
            />
            <View style={styles.textView}>
                <Text style={styles.text}>Video posted successfully.</Text>
            </View>
            
            <TouchableOpacity style={styles.backHomeBtn} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.btnText}>Back to home</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backHomeBtn: {
        justifyContent:'center',
        marginTop: 150,
        backgroundColor: "rgba(247,59,59,1)",
        borderWidth: 0,
        borderColor: "#000000",
        borderRadius: 100,
        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            width: 3,
            height: 10
        },
        elevation: 30,
        shadowOpacity: 0.11,
        shadowRadius: 10,
        width: 267,
        height: 43
    },
    btnText:{
        textAlign:"center",
        fontWeight:'700',
        color:"rgba(251,248,248,1)",
    },
    textView:{
        alignItems:'center',
    },
    text:{
        fontWeight:'800',
    }
});

export default SuccessScreen
