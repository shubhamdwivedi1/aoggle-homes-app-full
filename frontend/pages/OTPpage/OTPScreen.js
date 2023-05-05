import React, { useState, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, ToastAndroid,Alert ,BackHandler,ActivityIndicator} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from '@react-native-community/hooks';
import FeatherIcon from "react-native-vector-icons/Feather";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop:280
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        margin: 5,
        textAlign: 'center',
        width: 50,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        lineHeight: 25
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(247,59,59,1)',
        width: 150,
        padding: 16,
        borderRadius: 4,
        marginTop: 32,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
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
    icon: {
        paddingBottom: 20,
        color: 'black',
        fontSize: 30,
        marginHorizontal: 10,
    }
});

const OtpScreen = ({ registerData ,handleOTPScreen}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [otp, setOtp] = useState('');
    console.log(otp)
    const inputs = useRef([]);
    const handleBackPress = () => {
        Alert.alert(
            "Exit App",
            "Are you sure you want to exit from the register process?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => handleOTPScreen() }
            ]
          );
        return true;
    };
    useBackHandler(handleBackPress);
    const otpData = {
        otp: otp,
        mobileNumber: registerData.mobileNumber,
        countryCode: registerData.countryCode,
        username: registerData.username,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword
    }

    const handleVerifyOTP = async () => {
        setIsLoading(true)
        if (otp.length < 6) {
            setIsLoading(false)
            ToastAndroid.show('Please check the entered OTP', ToastAndroid.SHORT);
        }
        console.log("otp fumction")
        await axios.post('http://192.168.1.4:3000/api/auth/otpVerification', otpData).then(async (response) => {
            console.log(response);
            if (response.data.status === 'fail') {
                setIsLoading(false)
                ToastAndroid.show(`${response.data.message}`, ToastAndroid.SHORT);
            } if (response.data.status === 'success') {
                console.log(response.data.userDetails, response.data.token)
                await AsyncStorage.setItem("onboard-done", "true");
                await AsyncStorage.setItem("app-token", response.data.token);
                await AsyncStorage.setItem("app-userData", JSON.stringify(response.data.userDetails));
                setIsLoading(false)
            }
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleInputChange = (value, index) => {
        let newOtp = otp.split('');
        newOtp[index] = value;
        setOtp(newOtp.join(''));
        if (value && index < inputs.current.length - 1) {
            inputs.current[index + 1].focus();
        }
        else if (!value && index > 0) {
            newOtp[index - 1] = '';
            setOtp(newOtp.join(''));
            inputs.current[index - 1].focus();
        }
    };


    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={"rgba(247,59,59,1)"} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify your Mobile number</Text>
            <Text style={styles.subtitle}>
                Enter the 6-digit code which we sent to you at {registerData.mobileNumber}
            </Text>
            <View style={styles.otpContainer}>
                {[...Array(6)].map((_, index) => (
                    <TextInput
                        key={index}
                        style={styles.input}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(value) => handleInputChange(value, index)}
                        ref={(ref) => inputs.current[index] = ref}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
            <View style={styles.overlay3}>
                <TouchableOpacity>
                    <FeatherIcon name="arrow-left" style={styles.icon} onPress={() => handleBackPress}></FeatherIcon>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OtpScreen;
