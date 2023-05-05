import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions ,Alert} from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from "jwt-decode";
import { createStackNavigator } from '@react-navigation/stack';
//Plus...
import plus from './assets/plus.png'
//Font Awsome Icons
import { FontAwesome5 } from '@expo/vector-icons'
import { useRef, useEffect, useState } from 'react';
import RegisterScreen from './pages/RegisterPage/RegisterScreen';
import Profile from './pages/ProfilePage/ProfileScreen';
import LoginScreen from './pages/LoginPage/LoginScreen';
import CameraScreen from './pages/CameraPage/CameraScreen';
import Reels from './pages/HomePage/Reels';
import SearchPage from './pages/SearchPage/SearchPage';
import { AppState } from 'react-native';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';


const Tab = createBottomTabNavigator()


export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const [guest, setGuest] = useState(false);
  const [loginPage, setLoginPage] = useState(false)
  const [registerPage, setRegisterPage] = useState(false);
  const [showNavTab, setShowNavTab] = useState(true)
  const [currentTab, setCurrentTab] = useState('home')
  const [reels, setReels] = useState();
  const [newUser, setNewUser] = useState(false)
  const [onboardDone, setOnBoardDone] = useState(false)
  const Stack = createStackNavigator();
  const appState = useRef(AppState.currentState);
  const [isActive, setIsActive] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      Alert.alert('No Internet Connection', 'Please check your internet connection and try again.');
    }
  }, [isConnected]);



  useEffect(() => {
    if (currentTab === 'add') {
      setShowNavTab(false);
    } else {
      setShowNavTab(true);
    }
  }, [currentTab])

  useEffect(() => {
    if (currentTab === 'home') {
      setReels(true)
    } else {
      setReels(false)
    }
  }, [currentTab])

  function handleRegisterScreen() {
    setRegisterPage(true)
    setLoginPage(true)
  }

  function handleLoginScreen() {
    setLoginPage(false)
    setRegisterPage(false)
  }
  useEffect(() => {
    const checkUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("app-token");
        const guestUser = await AsyncStorage.getItem("app-guest");
        const onboardDone = await AsyncStorage.getItem("onboard-done");
        const userData = await AsyncStorage.getItem("app-userData");
        if (onboardDone === null) {
          setNewUser(true)
        } else {
          setNewUser(false)
        }
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
    const intervalId = setInterval(checkUserData, 50);
    return () => clearInterval(intervalId);
  }, []);



  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const data = { online: true, userData: userData }
        axios.post("http://192.168.1.2:3000/api/auth/set-online", data)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        const data = { online: false, userData: userData }
        axios.post("http://192.168.1.2:3000/api/auth/set-online", data)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }

      appState.current = nextAppState;
    });

    const checkIfExited = setTimeout(() => {
      const data = { online: false, userData: userData }
      if (appState.current !== 'active') {
        axios.post("http://192.168.1.2:3000/api/auth/set-online", data)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }
    }, 5000);

    return () => {
      subscription.remove();
      clearTimeout(checkIfExited);
    };
  }, [userData]);



  // Animated Tab indicator...
  const tabOffsetValue = useRef(new Animated.Value(0)).current;


  return (
    <NavigationContainer>
      {/* 
      {newUser ? <OnboardingPage/> : ""} */}

      {!loggedIn && !guest && !loginPage ? <LoginScreen handleRegisterScreen={handleRegisterScreen} /> : ""}

      {!loggedIn && !guest && loginPage ? <RegisterScreen handleLoginScreen={handleLoginScreen} /> : ""}

      {loggedIn || guest ?
        <Tab.Navigator screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: showNavTab ? 40 : -100,
            marginHorizontal: 20,
            height: showNavTab ? 60 : 0,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: {
              width: 10,
              height: 10
            },
            paddingHorizontal: 20,
          }
        }}>
          {
            // Tab screen
          }
          <Tab.Screen name='Home'
            component={HomeScreen}
            initialParams={{ reels: reels }}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <View style={{
                  position: 'absolute',
                  // top:'50%'
                }}>
                  <FontAwesome5 name="home" size={20} color={focused ? 'red' : 'gray'}></FontAwesome5>
                </View>
              ),

            }} listeners={({ navigation, route }) => ({
              //onpress update
              tabPress: e => {
                setCurrentTab('home')
                Animated.spring(tabOffsetValue, {
                  toValue: 0,
                  useNativeDriver: true
                }).start();
              },
              focus: e => {
                setCurrentTab('home')
              }
            })}></Tab.Screen>



          <Tab.Screen name='Search' component={SearchScreen} options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{
                position: 'absolute',
                // top:'50%'
              }}>
                <FontAwesome5 name="search" size={20} color={focused ? 'red' : 'gray'}></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            //onpress update
            tabPress: e => {
              setCurrentTab('search')
              Animated.spring(tabOffsetValue, {
                toValue: getWidth(),
                useNativeDriver: true
              }).start();
            },
            focus: e => {
              setCurrentTab('search')
            }
          })}></Tab.Screen>



          <Tab.Screen name='Add' component={EmptyScreen} options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View style={{
                width: 55,
                height: 55,
                backgroundColor: 'red',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 30
              }}>
                <FontAwesome5 name="plus" size={20} color={focused ? 'white' : 'white'}></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            //onpress update
            tabPress: e => {
              setCurrentTab('add')
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 2,
                useNativeDriver: true
              }).start();
            },
            focus: e => {
              setCurrentTab('add')
            }

          })}></Tab.Screen>

          <Tab.Screen name='Notification' component={MessageScreen} options={{
            tabBarIcon: ({ focused }) => (
              <View style={{
                position: 'absolute',
                // top:'50%'
              }}>
                <FontAwesome5 name="bell" size={20} color={focused ? 'red' : 'gray'}></FontAwesome5>
              </View>
            )
          }} listeners={({ navigation, route }) => ({
            //onpress update
            tabPress: e => {
              setCurrentTab('message')
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3,
                useNativeDriver: true
              }).start();
            },
            focus: e => {
              setCurrentTab('message')
            }

          })}></Tab.Screen>

          <Tab.Screen name='Profile'
            component={ProfileScreen}
            initialParams={{ userData: userData }}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <View style={{
                  position: 'absolute',
                  // top:'50%'
                }}>
                  <FontAwesome5 name="user" size={20} color={focused ? 'red' : 'gray'}></FontAwesome5>
                </View>
              )
            }} listeners={({ navigation, route }) => ({
              //onpress update
              tabPress: e => {
                setCurrentTab('profile')
                Animated.spring(tabOffsetValue, {
                  toValue: getWidth() * 4,
                  useNativeDriver: true
                }).start();
              },
              focus: e => {
                setCurrentTab('profile')
              }

            })}></Tab.Screen>

        </Tab.Navigator>

        : ""}

      {/* {showNavTab && loggedIn || guest ?

        <Animated.View style={{
          width: getWidth() - 20,
          height: 2,
          backgroundColor: 'blue',
          position: 'absolute',
          bottom: 98,
          left: 50,
          borderRadius: 50,
          transform: [
            { translateX: tabOffsetValue }
          ]
        }}>
        </Animated.View>

        : ""} */}

    </NavigationContainer>
  );
}





function getWidth() {
  let width = Dimensions.get("window").width

  width = width - 80
  return width / 5
}

function HomeScreen({ route }) {
  const [homeTab, setHomeTab] = useState(route.params.reels);

  useEffect(() => {
    setHomeTab(route.params.reels);
  }, [route.params.reels]);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Reels homeTab={homeTab} />
    </View>
  );
}

function SearchScreen() {
  return (
    <SearchPage />
  );
}


function EmptyScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <CameraScreen />
    </View>
  );
}


function MessageScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No Notification</Text>  
    </View>
  );
}

function ProfileScreen({ route }) {

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Profile />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
