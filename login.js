import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput } from 'react-native-paper';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import family_logo from './family_logo.png'
import ninjafamily from './ninjafamily.png'
import AuthContext from './AuthContext';

const logo = {
  'family_logo.png': family_logo,
  'ninjafamily.png': ninjafamily
}

const Login = ({ navigation }) => {
  const { setUsername, setIsParent } = useContext(AuthContext);
  const [username, setInput] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('parent');
  const [errorMessage, setErrorMessage] = useState('');
  const commonStyles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    tabContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      alignContent: 'center',
      alignSelf: 'center',
      marginTop: 50,
    },
    input: {
      elevation: 3,
      borderWidth: 2,
      borderColor: userType === 'parent' ? colors.primary : colors.keptGreen,
      backgroundColor: colors.white,
      marginBottom: 20,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'none',
      shadowOpacity: 0,
      shadowRadius: 0,
      borderRadius: 15,
    },
    button: {
      borderWidth: 1,
      borderColor: 'white',
      borderRadius: 5,
      backgroundColor: userType === 'parent' ? colors.primary : colors.keptGreen,
      color: colors.white,
      width: 125,
      height: 45,
      justifyContent: 'center',
      padding: 0,
      margin: 0,
      alignSelf: 'center',
    },
    title: {
      fontFamily: 'Inter_400Regular',
      fontSize: 40,
      color: 'black',
      alignSelf: 'center',
      fontStyle: 'italic',
    },
    link: {
      fontFamily: 'Inter_700Bold',
      color: 'black',
      textAlign: 'center',
      marginTop: 20,
    },
    tabSelected: {
      fontFamily: 'Inter_700Bold',
      backgroundColor: userType === 'parent' ? colors.primary : colors.keptGreen,
      color: colors.white,
      borderRadius: 10,
      width: 100,
      marginRight: 10,

    },
    tabUnselected: {
      fontFamily: 'Inter_700Bold',
      backgroundColor: '#F2F2F2',
      borderColor: userType === 'parent' ? colors.keptGreen : colors.primary,
      borderWidth: 2,
      color: colors.white,
      borderRadius: 10,
      width: 100,
      marginRight: 10,
    },
  };

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  const handleLogin = async () => {
    console.log(username, password);
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password, user_type: userType }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Logged in successfully!', data);
        setUsername(data.username);
        await AsyncStorage.setItem('sessionId', data.sessionId);
        const savedUsername = await AsyncStorage.setItem('username');
  
        console.log('Retrieved username from AsyncStorage:', savedUsername);
        console.log('username is ' + username);
        console.log('data.username is ' + data.username);
        console.log(data);
        console.log(data.userType)
        if (data.userType === 'parent' && data.familyID !== null) {
          setIsParent(true);
        } else if (data.userType === 'kid' && data.familyID !== null) {
          setIsParent(false);
        }
  
        // Check for familyID and navigate accordingly
        if (!data.familyID) {
          navigation.navigate('newParent');
          return;  // exit the function to prevent further processing
        }
  
      } else {
        console.error(data.message || 'Login failed.');
        setErrorMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setErrorMessage('Error logging in. Please try again.');
    }
  };
  

  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}></Text>
      <Image source={logo['ninjafamily.png']} style={{ alignSelf: 'center', width: 300, height: 37, margin: 20, }} />
      <Image source={logo['family_logo.png']} style={{ alignSelf: 'center', width: 200, height: 200, }} />

      <View style={commonStyles.tabContainer}>
        <Button
          onPress={() => setUserType('parent')}
          mode="text"
          style={
            userType === 'parent'
              ? commonStyles.tabSelected
              : commonStyles.tabUnselected
          }
        >
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              color:
                userType === 'parent' ? colors.white : colors.primary,
            }}
          >
            Parent
          </Text>
        </Button>

        <Button
          onPress={() => setUserType('kid')}
          mode="text"
          style={
            userType === 'kid'
              ? commonStyles.tabSelected
              : commonStyles.tabUnselected
          }
        >
          <Text
            style={{
              fontFamily: 'Inter_400Regular',
              color: userType === 'kid' ? colors.white : colors.keptGreen,
            }}
          >
            Kid
          </Text>
        </Button>
      </View>

      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setInput(text)}
        style={commonStyles.input}
        theme={{
          colors: { primary: '#1960bd', underlineColor: 'transparent' },
          roundness: 15
        }}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={commonStyles.input}
        theme={{ colors: { primary: '#1960bd' }, roundness: 15 }}
      />
      <Button onPress={handleLogin} style={commonStyles.button}>
        <Text style={{ color: 'white' }}>Login</Text>
      </Button>


      <Text
        onPress={() => navigation.navigate('Register')}
        style={commonStyles.link}
      >
        Don't have an account? Register
      </Text>
      {errorMessage && <Text style={{fontWeight: 800, marginTop: 20, fontFamily: 'Inter_400Regular', color:'red', textAlign: 'center' }}>{errorMessage}</Text>}

    </View>
  );
};

const colors = {
  white: 'white',
  primary: '#1960bd',
  black: 'black',
  borderGrey: '#ccc',
  textGrey: '#555',
  strikeGrey: '#ddd',
  strikeActive: '#d43a2f',
  keptGreen: '#7f32a8',
};

export default Login;