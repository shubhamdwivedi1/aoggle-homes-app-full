import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from "react-native-vector-icons/Feather";
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import InstagramProfile from './PostListFlatlist';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

const Profile = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(false);
    const [userName, setUserName] = useState();
    const [postIds, setPostIds] = useState()
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const handleBackPress = () => {
        navigation.goBack()
        return true;
    };
    useBackHandler(handleBackPress);
    let guest = "Guest User    "
    let postCount = 0
    console.log(postIds)
    useEffect(() => {
        setIsLoading(true)
        const checkUser = async () => {
            const userDatas = await AsyncStorage.getItem("app-userData")
            const userDataObj = JSON.parse(userDatas)
            console.log(userDataObj._id)
            if (userDatas != undefined || null && isFocused) {
                await axios.get('http://192.168.1.2:3000/post/video-post/get-profile-posts', {
                    params: {
                        userId: userDataObj._id
                    }
                }).then((response) => {
                    setPostIds(response.data)
                })
                console.log(userDataObj._id)
                setUserName(userDataObj.username)
                setUser(true);
                setIsLoading(false)
            } else {
                setIsLoading(false)
                setUser(false);
            }
        }
        
        checkUser()
    }, [])






    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }


    const handleLogout = async () => {
        try {
            await AsyncStorage.clear(); 
            console.log("removing from storage")
            await AsyncStorage.removeItem("app-token").then((response) => {
                console.log("token ", response)
            })
            await AsyncStorage.removeItem("app-userData").then((response) => {
                console.log("userData ", response)
            })
            await AsyncStorage.removeItem("app-guest").then((response) => {
                console.log("guest ", response)
            })
        } catch (error) {
            console.log('Error logging out:', error);
        }
    }

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={"rgba(247,59,59,1)"} />
            </View>
        )
    }


    return (

        <View style={styles.container}>
            <View style={styles.rect}>
                <View style={styles.userNameRow}>
                    <Text style={styles.userName}>{user ? userName : guest}</Text>
                    <Icon name="menu" style={styles.icon1} onPress={toggleMenu}></Icon>
                </View>
            </View>
            <View style={styles.rect2}>
                <View style={styles.button1Row}>
                    <TouchableOpacity style={styles.button1}>
                    <Image source={{ uri: "https://d1a7ha9naxjmi1.cloudfront.net/User-Profile-PNG-Image.png" }} style={styles.profileImage} />
                    </TouchableOpacity>
                    <View style={styles.loremIpsum1Column}>
                        <Text style={styles.loremIpsum1}>{postIds ? postIds.length : postCount}</Text>
                        <Text style={styles.posts1}>Posts</Text>
                    </View>
                </View>
            </View>


            {postIds !== undefined ? <InstagramProfile postIds={postIds} /> : ""}


            <Modal visible={showMenu} transparent={true}>
                <TouchableOpacity style={styles.modalBackground} onPress={toggleMenu}>
                    <View style={styles.modal}>
                        <TouchableOpacity style={styles.modalItem} onPress={() => { handleLogout(); toggleMenu(); }}>
                            <Text style={styles.modalItemText}>Logout</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem} onPress={() => { toggleMenu(); }}>
                            <Text style={styles.modalItemText}>Privacy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalItem}>
                            <Text style={styles.modalItemText}>Help</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    rect: {
        width: 358,
        height: 52,
        // backgroundColor: "rgba(155,155,155,0.35)",
        flexDirection: "row",
        marginTop: 47,
        alignSelf: "center"
    },
    userName: {
        color: "#121212",
        textAlign: "center",
        fontSize: 23,
        marginTop: 1
    },
    icon1: {
        position: 'absolute',
        color: "rgba(0,0,0,1)",
        fontSize: 29,
        height: 29,
        width: 29,
        marginLeft: 300
    },
    userNameRow: {
        height: 29,
        flexDirection: "row",
        flex: 1,
        marginRight: 17,
        marginLeft: 16,
        marginTop: 11
    },
    rect2: {
        width: 352,
        height: 147,
        // backgroundColor: "#E6E6E6",
        marginTop: 16,
    },
    button1: {
        width: 92,
        height: 92,
        backgroundColor: "rgba(155,155,155,0.35)",
        borderWidth: 0,
        borderColor: "#000000",
        borderRadius: 50
    },
    loremIpsum1: {
        color: "#121212",
        marginLeft: 13
    },
    posts1: {
        color: "#121212",
        marginTop: 7,
        fontWeight:'bold'
    },
    loremIpsum1Column: {
        width: 40,
        marginLeft: 53,
        marginTop: 29,
        marginBottom: 22
    },
    button1Row: {
        height: 92,
        flexDirection: "row",
        marginTop: 27,
        marginLeft: 14,
        marginRight: 157
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        // alignItems: 'center',
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        minWidth: Dimensions.get('window').width,
    },
    modalItem: {
        paddingVertical: 10,
    },
    modalItemText: {
        fontSize: 16,
    },
    profileImage:{
        width: '100%', // set the width and height to cover the entire button
        height: '100%',
        borderRadius:50
    }
});



export default Profile;
