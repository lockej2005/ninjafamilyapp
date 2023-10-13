import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import family_logo from './family_logo.png';
import ninjafamily from './ninjafamily.png';
import soliderImage from './profilepic/solider.png';
import mafiabossImage from './profilepic/mafiaboss.png';
import princessImage from './profilepic/princess.png';
import ninjaImage from './profilepic/ninja.png';
import skatergirlImage from './profilepic/skatergirl.png';

const profileImages = {
  'solider.png': soliderImage,
  'mafiaboss.png': mafiabossImage,
  'princess.png': princessImage,
  'ninja.png': ninjaImage,
  'skatergirl.png': skatergirlImage,
};

const parentAvatars = ['mafiaboss.png', 'ninja.png', 'princess.png']; // Add parent avatars
const kidAvatars = ['mafiaboss.png', 'ninja.png', 'princess.png']; // Add kid avatars

const logo = {
  'family_logo.png': family_logo,
  'ninjafamily.png': ninjafamily,
};

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('parent'); // Default role is 'parent'
  const [selectedAvatar, setSelectedAvatar] = useState(parentAvatars[0]); // Default parent avatar

  const colors = {
    white: 'white',
    primary: '#1960bd',
    black: 'black',
    parentPrimary: '#1960bd', // Set parent primary color
    kidPrimary: '#7f32a8', // Set kid primary color to purple
  };

  const commonStyles = {
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    input: {
      elevation: 3,
      borderWidth: 2,
      borderColor: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
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
      backgroundColor: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
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
      backgroundColor: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
      color: colors.white,
      borderRadius: 10,
      width: 100,
      marginRight: 10,
      borderColor: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
      borderWidth: 2,
    },
    tabUnselected: {
      fontFamily: 'Inter_700Bold',
      backgroundColor: '#F2F2F2',
      borderColor: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
      borderWidth: 2,
      color: role === 'kid' ? colors.kidPrimary : colors.parentPrimary,
      borderRadius: 10,
      width: 100,
      marginRight: 10,
    },
    avatarContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    selectedAvatar: {
      borderColor: colors.primary,
      borderRadius: 5,
      backgroundColor: 'white',
    },
  };

  const handleRegister = async () => {
    console.log('handleRegister function is called');
  
    try {
      const registerData = { name, username, email, password, role, selectedAvatar };
      console.log(registerData);
  
      const response = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        body: JSON.stringify(registerData), // Convert to JSON string
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
        },
        credentials: 'include', // Include credentials if your API requires authentication
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Registered successfully!', data);
        await AsyncStorage.setItem('username', username);
        navigation.navigate('newParent');
      } else {
        console.error(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };
  
  

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <View style={commonStyles.container}>
      <Image source={logo['ninjafamily.png']} style={{ alignSelf: 'center', width: 300, height: 37, margin: 20 }} />
      <Image source={logo['family_logo.png']} style={{ alignSelf: 'center', width: 200, height: 200 }} />
      <View style={{ flexDirection: 'row', marginBottom: 20, alignContent: 'center', alignSelf: 'center', marginTop: 20 }}>
        <Button
          onPress={() => setRole('parent')}
          mode="text"
          style={role === 'parent' ? commonStyles.tabSelected : commonStyles.tabUnselected}
        >
          <Text style={{ fontFamily: 'Inter_400Regular', color: role === 'parent' ? colors.white : colors.parentPrimary }}>Parent</Text>
        </Button>
        <Button
          onPress={() => setRole('kid')}
          mode="text"
          style={role === 'kid' ? commonStyles.tabSelected : commonStyles.tabUnselected}
        >
          <Text style={{ fontFamily: 'Inter_400Regular', color: role === 'kid' ? colors.white : colors.kidPrimary }}>Kid</Text>
        </Button>
      </View>
      <TextInput
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={commonStyles.input}
        theme={{ colors: { primary: role === 'kid' ? colors.kidPrimary : colors.parentPrimary }, roundness: 15 }}
        underlineColor="transparent"
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={commonStyles.input}
        theme={{ colors: { primary: role === 'kid' ? colors.kidPrimary : colors.parentPrimary }, roundness: 15 }}
        underlineColor="transparent"
      />
      {role === 'parent' && (
        <TextInput
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={commonStyles.input}
          theme={{ colors: { primary: role === 'kid' ? colors.kidPrimary : colors.parentPrimary }, roundness: 15 }}
          underlineColor="transparent"
        />
      )}
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={commonStyles.input}
        theme={{ colors: { primary: role === 'kid' ? colors.kidPrimary : colors.parentPrimary }, roundness: 15 }}
        underlineColor="transparent"
      />

      <View style={commonStyles.avatarContainer}>
        {(role === 'parent' ? parentAvatars : kidAvatars).map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedAvatar(avatar)}
          >
            <Image
              source={{ uri: profileImages[avatar] }}
              style={[
                commonStyles.avatar,
                selectedAvatar === avatar ? commonStyles.selectedAvatar : null,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Button onPress={handleRegister} style={commonStyles.button}>
        <Text  style={{ color: 'white' }}>Create</Text>
      </Button>

      <Text onPress={() => navigation.navigate('Login')} style={commonStyles.link}>Already have an account? Login</Text>
    </View>
  );
};

export default Register;
