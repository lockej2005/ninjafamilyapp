import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getStyles from '../styles';
import soldierImage from '../profilepic/solider.png';
import mafiabossImage from '../profilepic/mafiaboss.png';
import princessImage from '../profilepic/princess.png';
import ninjaImage from '../profilepic/ninja.png';
import skatergirlImage from '../profilepic/skatergirl.png';

const profileImages = {
  'solider.png': soldierImage,
  'mafiaboss.png': mafiabossImage,
  'princess.png': princessImage,
  'ninja.png': ninjaImage,
  'skatergirl.png': skatergirlImage,
};


const generateRandomCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNum = () => Math.floor(Math.random() * 10);

  return `${randomLetter()}${randomLetter()}${randomLetter()}${randomNum()}${randomNum()}${randomNum()}`;
};

const example = 'parent';

const OurFamily = ({ navigation, userType }) => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const styles = getStyles('kid');
  const [selectedResetOption, setSelectedResetOption] = useState('Week');
  const [familyID, setFamilyID] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      const familyID = await AsyncStorage.getItem('familyID');
      console.log(familyID)
      try {
        const familyUsers = await axios.get(`http://localhost:3000/api/family-members?familyID=${familyID}`, {
          withCredentials: true
        });
        if (familyUsers !== null) {
          setFamilyMembers(familyUsers.data); // note the .data property, as axios stores the returned data in this property      
          } } catch (error) {
        console.error("Failed to fetch family members from AsyncStorage:", error);
      }
    };

    const fetchInviteCode = async (familyID) => {
      try {
        const response = await axios.get(`http://localhost:3000/api/family-invite-code?familyID=${familyID}`, {
          withCredentials: true
        });
        if (response.data && response.data.inviteCode) {
          setInviteCode(response.data.inviteCode);
        }
      } catch (error) {
        console.error("Failed to fetch invite code from backend:", error);
      }
    };

    const fetchFamilyID = async () => {
      try {
        const storedFamilyID = await AsyncStorage.getItem('familyID');
        if (storedFamilyID) {
          setFamilyID(storedFamilyID);
          return storedFamilyID;
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch familyID from AsyncStorage:", error);
        return null;
      }
    };

    fetchFamilyID().then(fetchedID => {
      if (fetchedID) {
        fetchInviteCode(fetchedID);
      }
    });
    fetchFamilyMembers();
  }, [isFocused]);

  const handleNewCodeGeneration = async () => {
    const newCode = generateRandomCode();

    try {
      await axios.post('http://localhost:3000/api/set-family-invite-code', {
        inviteCode: newCode,
        familyID
      }, {
        withCredentials: true
      });
      setInviteCode(newCode);
    } catch (error) {
      console.error("Failed to post new invite code to backend:", error);
    }
  };

  const handleProfileClick = (user) => {
    navigation.navigate('UserProfile', { user });
  };

  const renderFamilyData = () => {
    return familyMembers.map((item) => (
      <TouchableOpacity key={item.id} onPress={() => handleProfileClick(item)}>
        <Card style={styles.memberCard} key={item.id}>
          <Card.Content style={styles.cardContent}>
            <Image source={profileImages[item.ProfilePic]} style={styles.profileIcon} />
            <Text>{item.Name}</Text>
            <Paragraph style={styles.promiseScore}>Score: {item.PromiseScore}</Paragraph>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    ));
  };

  const renderIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
        <View style={[styles.indicator, styles.indicatorActive]} />
      </View>
    );
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.mainContainer}>
        {renderIndicator()}
        <Text style={styles.dashboardTitle}>Our Family</Text>
        <View style={styles.resetSection}>
          <Text style={styles.title}>Reset Score every:</Text>
          <View style={styles.resetSelector}>
            <TouchableOpacity 
              style={selectedResetOption === 'Week' ? styles.resetBtn : styles.resetBtnInactive} 
              onPress={() => setSelectedResetOption('Week')}>
              <Text style={styles.text}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={selectedResetOption === 'Month' ? styles.resetBtn : styles.resetBtnInactive} 
              onPress={() => setSelectedResetOption('Month')}>
              <Text style={styles.text}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardContainer}>{renderFamilyData()}</View>
      </View>
      <View style={styles.inviteSection}>
        <Text style={styles.inviteTitle}>Invite Code</Text>
        <Text style={styles.inviteCode}>{inviteCode}</Text>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.setRewardsButton} onPress={handleNewCodeGeneration}>
            <Text style={styles.buttonText}>Generate New Code</Text>
        </TouchableOpacity>
        <Text style={styles.requestText}>Trouble joining a family? Email me on the address josh.locke@outlook.com</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OurFamily;
