import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions, TextInput, ActivityIndicator, FlatList } from 'react-native';
import axios from 'axios';
import filter from 'lodash.filter'
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const handleBackPress = () => {
    navigation.navigate('Home');
    return true;
  };
  useBackHandler(handleBackPress);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData)
  }

  const contains = ({ username, mobileNumber }, query) => {
    if (username.toLowerCase().includes(query) || mobileNumber.includes(query)) {
      return true
    }
    return false
  }

  const getUsers = async () => {
    try {
      await axios.get('http://192.168.1.2:3000/api/auth/get-users').then((response) => {
        setData(response.data)
        setFullData(response.data)
        setIsLoading(false)
      })
    } catch (error) {
      console.log(error);
      setError(error)
      setIsLoading(false)
    }

  }

  useEffect(() => {
    setIsLoading(true);
    getUsers()
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} color={"rgba(247,59,59,1)"} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error in fetching data ... Please check your internet connection !</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder='Search' clearButtonMode='always' style={styles.textInput} autoCapitalize='none' autoCorrect={false} value={searchQuery} onChangeText={(query) => handleSearch(query)} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.username}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.itemContainerBtn}>
              <Image source={{ uri: "https://d1a7ha9naxjmi1.cloudfront.net/blankProfile.png" }} style={styles.image} />
              <View>
                <Text style={styles.textName}>{item.username}</Text>
                <Text style={styles.textNumber}>{item.mobileNumber}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingRight: 20,
    paddingLeft: 20,
  },
  textInput: {
    paddingHorizontal: 28,
    paddingVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  }, itemContainerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
  },
  textNumber: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '300',
  }
})

export default SearchPage
