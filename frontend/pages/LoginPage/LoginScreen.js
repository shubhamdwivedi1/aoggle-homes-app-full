import React, { Component, useState ,useEffect} from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ToastAndroid , Platform , ToastIOS ,ActivityIndicator} from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import OnboardingPage from "../Onboarding/Onboarding";

function LoginScreen({ handleRegisterScreen }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [newUser,setNewUser] = useState(false)

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const onboardDone = await AsyncStorage.getItem("onboard-done");
        if(onboardDone=== null){
          setNewUser(true)
        }else{
          setNewUser(false)
        }
      } catch (error) {
        console.log('Error checking user data:', error);
      }
    }
    checkUserData()
    const intervalId = setInterval(checkUserData, 50);
    return () => clearInterval(intervalId);
  }, []);


  const Login = async () => {
    setIsLoading(true)
    const loginData = {
      mobileNumber: mobileNumber,
      password: password
    }

    if (mobileNumber === '') {
      setIsLoading(false)
      Toast.show(`Please enter the registered mobile number..`, Toast.LONG, ['UIAlertController']);
      return null;
    }
    if(password === ''){
      setIsLoading(false)
      Toast.show(`Please enter your Password.`, Toast.LONG, ['UIAlertController']);
      return null;
    }
    else {
      await axios.post('http://192.168.1.2:3000/api/auth/login', loginData).then(async (response) => {
        if (response.data.status === 'success') {
          await AsyncStorage.setItem("app-token", response.data.token);
          await AsyncStorage.setItem("app-userData", JSON.stringify(response.data.user));
          await AsyncStorage.setItem("onboard-done", "true");
          setIsLoading(false)
        }
        if (response.data.status === 'fail') {
          setIsLoading(false)
          Toast.show(`${response.data.message}`, Toast.LONG, ['UIAlertController']);
          return null
        }
      })
    }
  }

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={"rgba(247,59,59,1)"} />
        </View>
    )
}

if (newUser) {
  return (
      <OnboardingPage/>
  )
}

  return (
    <View style={styles.container}>
      <View style={styles.loginStack}>
        <Text style={styles.login}>LOGIN</Text>
        <View style={styles.rect1}></View>
      </View>
      <View style={styles.rect2}>
        <TextInput placeholder="Mobilenumber" style={styles.textInput} onChangeText={setMobileNumber} keyboardType="numeric"></TextInput>
      </View>
      <View style={styles.rect3}>
        <TextInput placeholder="Password" style={styles.textInput} secureTextEntry={true} onChangeText={setPassword}></TextInput>
      </View>
      <TouchableOpacity style={styles.button1} onPress={Login}>
        <Text style={styles.login2}>LOGIN</Text>
      </TouchableOpacity>
      <Text style={styles.loremIpsum}>
        If you doesn;t have an account please {"\n"}
        <TouchableOpacity onPress={handleRegisterScreen}><Text style={styles.loginButton}>Register.</Text></TouchableOpacity>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  login: {
    top: 0,
    position: "absolute",
    // fontFamily: "roboto-700",
    color: "#121212",
    height: 75,
    width: 375,
    fontSize: 40,
    textAlign: "center",
    left: 0
  },
  rect1: {
    top: 48,
    left: 157,
    width: 58,
    height: 5,
    position: "absolute",
    backgroundColor: "rgba(247,4,4,1)",
    borderWidth: 1,
    borderColor: "rgba(246,8,8,1)",
    borderRadius: 100
  },
  loginStack: {
    width: 375,
    height: 75,
    marginTop: 119
  },
  rect2: {
    width: 294,
    height: 49,
    backgroundColor: "rgba(255,252,252,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "solid",
    borderRadius: 13,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 30,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    overflow: "hidden",
    marginTop: 56,
    marginLeft: 52
  },
  materialUnderlineTextbox5: {
    height: 49,
    width: 275,
    marginLeft: 19
  },
  rect3: {
    width: 294,
    height: 49,
    backgroundColor: "rgba(255,252,252,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderStyle: "solid",
    borderRadius: 13,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 30,
    shadowOpacity: 0.09,
    shadowRadius: 10,
    overflow: "hidden",
    marginTop: 29,
    marginLeft: 52
  },
  materialUnderlineTextbox6: {
    height: 48,
    width: 275,
    marginLeft: 19
  },
  button1: {
    width: 294,
    height: 46,
    backgroundColor: "rgba(247,59,59,1)",
    borderWidth: 1,
    borderColor: "rgba(225,44,44,1)",
    borderRadius: 11,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      height: 10,
      width: 10
    },
    elevation: 30,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    marginTop: 93,
    marginLeft: 52
  },
  login2: {
    // fontFamily: "roboto-700",
    color: "rgba(251,248,248,1)",
    height: 25,
    width: 78,
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
    marginLeft: 105
  },
  loremIpsum: {
    paddingTop: 20,
    // fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    textAlign: "center",
  },
  textInput: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 49,
    width: 261,
    fontSize: 15,
    marginLeft: 32
  },
  loginButton: {
    color: 'red',
  }
});

export default LoginScreen;
