import React, { Component, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import OtpScreen from "../OTPpage/OTPScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CountryPicker from 'react-native-country-picker-modal';

function RegisterScreen({ handleLoginScreen }) {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [username, setUsername] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpPage, setOtpPage] = useState(false);
  const [otpMobileNum, setOtpMobileNum] = useState('')
  const countryPickerRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  console.log(username)

  const COUNTRY_LIST = [
    { code: '+1', flag: '\uD83C\uDDFA\uD83C\uDDF8' }, // United States
    { code: '+93', flag: '\uD83C\uDDE6\uD83C\uDDEB' }, // Afghanistan
    { code: '+355', flag: '\uD83C\uDDE6\uD83C\uDDEA' }, // Albania
    { code: '+213', flag: '\uD83C\uDDE9\uD83C\uDDFF' }, // Algeria
    { code: '+376', flag: '\uD83C\uDDE6\uD83C\uDDE9' }, // Andorra
    { code: '+244', flag: '\uD83C\uDDE6\uD83C\uDDF7' }, // Angola
    { code: '+1-268', flag: '\uD83C\uDDE6\uD83C\uDDEC' }, // Antigua and Barbuda
    { code: '+54', flag: '\uD83C\uDDE6\uD83C\uDDF7' }, // Argentina
    { code: '+374', flag: '\uD83C\uDDE6\uD83C\uDDFA' }, // Armenia
    { code: '+61', flag: '\uD83C\uDDE6\uD83C\uDDFA' }, // Australia
    { code: '+43', flag: '\uD83C\uDDE6\uD83C\uDDF9' }, // Austria
    { code: '+994', flag: '\uD83C\uDDE6\uD83C\uDDFF' }, // Azerbaijan
    { code: '+1-242', flag: '\uD83C\uDDE7\uD83C\uDDEE' }, // Bahamas
    { code: '+973', flag: '\uD83C\uDDE7\uD83C\uDDEA' }, // Bahrain
    { code: '+880', flag: '\uD83C\uDDE7\uD83C\uDDF4' }, // Bangladesh
    { code: '+1-246', flag: '\uD83C\uDDE7\uD83C\uDDEE' }, // Barbados
    { code: '+375', flag: '\uD83C\uDDE7\uD83C\uDDFE' }, // Belarus
    { code: '+32', flag: '\uD83C\uDDE7\uD83C\uDDEA' }, // Belgium
    { code: '+501', flag: '\uD83C\uDDE7\uD83C\uDDEA' }, // Belize
    { code: '+229', flag: '\uD83C\uDDE7\uD83C\uDDEF' }, // Benin
    { code: '+975', flag: '\uD83C\uDDE7\uD83C\uDDF9' }, // Bhutan
    { code: '+591', flag: '\uD83C\uDDE7\uD83C\uDDEA' }, // Bolivia
    { code: '+387', flag: '\uD83C\uDDE7\uD83C\uDDE6' }, // Bosnia and Herzegovina
    { code: '+267', flag: '\uD83C\uDDE7\uD83C\uDDFE' }, // Botswana
    { code: '+55', flag: '\uD83C\uDDE7\uD83C\uDDF7' }, // Brazil
    { code: '+673', flag: '\uD83C\uDDE7\uD83C\uDDF3' }, // Brunei Darussalam
    { code: '+91', flag: '\uD83C\uDDEE\uD83C\uDDF3' }
  ]


  const registerData = {
    username: username,
    mobileNumber: mobileNumber,
    countryCode: countryCode,
    password: password,
    confirmPassword: confirmPassword
  };

  const register = async () => {
    setIsLoading(true)
    console.log("register function working")

    if (countryCode === '') {
      console.log("country code is empty")
    }
    if (username === '') {
      Toast.show(`Please enter your username.`, Toast.LONG, ['UIAlertController']);
      setIsLoading(false)
      return null
    }
    if (mobileNumber === '') {
      Toast.show(`Please enter your mobile number.`, Toast.LONG, ['UIAlertController']);
      setIsLoading(false)
      return null
    }
    if (password === '') {
      Toast.show(`Please enter your Password.`, Toast.LONG, ['UIAlertController']);
      setIsLoading(false)
      return null
    }
    if (confirmPassword === '') {
      Toast.show(`Please confirm your password.`, Toast.LONG, ['UIAlertController']);
      setIsLoading(false)
      return null
    }
    if (password != confirmPassword) {
      Toast.show(`password and confirm password must be same.`, Toast.LONG, ['UIAlertController']);
      setIsLoading(false)
      return null
    }
    else {
      await axios.post('http://192.168.1.2:3000/api/auth/signup', registerData).then((response) => {
        console.log("response client ", response.data)
        if (response.data.status === 'success') {
          setIsLoading(false)
          setOtpPage(true);
        }
        if (response.data.status === 'userExist') {
          setIsLoading(false)
          Toast.show(`This mobile number is already registered. Please try login.`, Toast.LONG, ['UIAlertController']);
        }
      }).catch((err) => {
        setIsLoading(false)
        Toast.show(`Something went wrong. Please try again later.`, Toast.LONG, ['UIAlertController']);
      })
    }
  }

  async function countinueWithoutRegister() {
    console.log("guest user working");
    await AsyncStorage.setItem("app-guest", "true");
  }

  function handleLogin() {
    //Open login page
    handleLoginScreen()
  }

  function handleOTPScreen() {
    setOtpPage(false)
  }

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={'large'} color={"rgba(247,59,59,1)"} />
        </View>
    )
}

  return (
    <ScrollView>
      <View style={styles.container}>
        {otpPage ? <OtpScreen registerData={registerData} handleOTPScreen={handleOTPScreen} /> :
          <View>
            <View style={styles.registerStack}>
              <Text style={styles.register}>REGISTER</Text>
              <View style={styles.rect5}></View>
            </View>
            <View style={styles.rect}>
              <TextInput placeholder="Username" style={styles.textInput} onChangeText={(text) => setUsername(text.replace(/\s/g, ''))} maxLength={15} autoCorrect={false}></TextInput>
            </View>
            <View style={styles.button3Row}>
              <TouchableOpacity style={styles.button3} onPress={() => setModalVisible(true)}>
                <Text style={styles.textInput5}>{countryCode} 🔽</Text>
              </TouchableOpacity>



              <View style={styles.rect1}>
                <TextInput
                  placeholder="Mobile Number"
                  dataDetector="phoneNumber"
                  clearButtonMode="while-editing"
                  placeholderTextColor="rgba(156,151,151,1)"
                  selectionColor="rgba(112,95,95,1)"
                  style={styles.textInput2}
                  onChangeText={setMobileNumber}
                  keyboardType="numeric"
                ></TextInput>
              </View>
            </View>
            <View style={styles.rect3}>
              <TextInput placeholder="Password" style={styles.textInput3} secureTextEntry={true} onChangeText={setPassword}></TextInput>
            </View>
            <View style={styles.rect4}>
              <TextInput
                placeholder="Confirm Password"
                style={styles.textInput4}
                secureTextEntry={true}
                onChangeText={setConfirmPassword}
              ></TextInput>
            </View>
            <View style={styles.buttonStack}>
              <TouchableOpacity style={styles.button} onPress={register}>
                <Text style={styles.register3}>REGISTER</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.or2}>or</Text>
            <TouchableOpacity style={styles.button2} onPress={countinueWithoutRegister}>
              <Text style={styles.loremIpsum}>Continue Without SignUp</Text>
            </TouchableOpacity>
            <Text style={styles.loremIpsum1}>
              If you already have an account please{"\n"}
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginButton}>Login</Text>
              </TouchableOpacity>
            </Text>
          </View>}



        <Modal visible={modalVisible} animationType="slide" transparent={true} style={styles.ModalStyle}>
          <View style={styles.modalContent}>
            <ScrollView>
              {COUNTRY_LIST.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={styles.countryItem}
                  onPress={() => {
                    setModalVisible(false);
                    setCountryCode(country.code);
                  }}
                >
                  <Text style={styles.countryCode}>{country.code}</Text>
                  <Text style={styles.countryCode}>{country.flag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  register: {
    top: 0,
    position: "absolute",
    // fontFamily: "anek-devanagari-700",
    color: "#121212",
    height: 75,
    width: 375,
    fontSize: 40,
    textAlign: "center",
    left: 0
  },
  rect5: {
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
  registerStack: {
    width: 375,
    height: 75,
    marginTop: 119
  },
  rect: {
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
    marginTop: 29,
    marginLeft: 52
  },
  textInput: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 49,
    width: 261,
    fontSize: 15,
    marginLeft: 32
  },
  button3: {
    width: 53,
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
    flex: 1,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: "hidden"
  },
  textInput5: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 17,
    width: 32,
    fontSize: 15,
    // marginTop: 16,
    marginLeft: 10
  },
  rect1: {
    width: 226,
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
    shadowOpacity: 0.08,
    shadowRadius: 10,
    overflow: "hidden",
    marginLeft: 15
  },
  textInput2: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 49,
    width: 204,
    fontSize: 15,
    textAlign: "justify",
    marginLeft: 21
  },
  button3Row: {
    height: 49,
    flexDirection: "row",
    marginTop: 35,
    marginLeft: 52,
    marginRight: 29
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
    marginTop: 39,
    marginLeft: 52
  },
  textInput3: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 49,
    width: 267,
    fontSize: 15,
    textAlign: "justify",
    marginLeft: 26
  },
  rect4: {
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
    marginTop: 28,
    marginLeft: 52
  },
  textInput4: {
    // fontFamily: "anek-devanagari-700",
    color: "rgba(115,114,114,1)",
    height: 49,
    width: 267,
    fontSize: 15,
    marginLeft: 26
  },
  button: {
    top: 0,
    left: 6,
    width: 294,
    height: 46,
    position: "absolute",
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
    shadowRadius: 10
  },
  register3: {
    top: 12,
    left: 0,
    position: "absolute",
    // fontFamily: "roboto-700",
    color: "rgba(255,252,252,1)",
    height: 23,
    width: 294,
    fontSize: 18,
    textAlign: "center"
  },
  buttonStack: {
    width: 300,
    height: 46,
    marginTop: 47,
    marginLeft: 46
  },
  or2: {
    // fontFamily: "anek-devanagari-700",
    color: "#121212",
    height: 26,
    width: 33,
    fontSize: 19,
    textAlign: "center",
    marginTop: 12,
    marginLeft: 176
  },
  button2: {
    width: 294,
    height: 44,
    backgroundColor: "rgba(223,215,215,1)",
    borderRadius: 4,
    marginTop: 9,
    marginLeft: 51
  },
  loremIpsum: {
    // fontFamily: "anek-devanagari-700",
    color: "#121212",
    height: 19,
    width: 197,
    textAlign: "center",
    fontSize: 16,
    marginTop: 13,
    marginLeft: 48
  },
  loremIpsum1: {
    paddingTop: 20,
    // fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    textAlign: "center"
  },
  loginButton: {
    color: 'red'
  },
  modalContent: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'white',
    width: Dimensions.get('screen').width,
    marginTop: 50
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  countryCode: {
    fontSize: 16,
    marginLeft: 10,
  },
  ModalStyle: {
    marginTop: 100
  }
});

export default RegisterScreen;
