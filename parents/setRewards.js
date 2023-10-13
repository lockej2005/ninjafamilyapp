import React, { useState, useEffect, useContext } from 'react';
import { useIsFocused } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity } from 'react-native';
import getStyles from '../styles';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { DataContext } from '../DataContext';

const SetRewards = () => {
  const [userNames, setUserNames] = useState('');
  const [score, setScore] = useState('');
  const [reward, setReward] = useState('');
  const [allRewardsData, setAllRewardsData] = useState([]);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isFocused = useIsFocused();
  const { setRefreshData, kidsUsernames } = useContext(DataContext)


  const styles = getStyles('parent');

  useEffect(() => {
    fetchFamilyUsersAndTheirRewards();
    loadKidsUsernames();
  }, [isFocused]);

  const loadKidsUsernames = async () => {
    try {
      const storedKidsUsernames = await AsyncStorage.getItem('kidsUsernames');
      const kidsUsernamesArray = JSON.parse(storedKidsUsernames);
      console.log(kidsUsernamesArray)
      setUserSuggestions(kidsUsernames);
    } catch (error) {
      console.error("Error loading kids usernames:", error);
    }
  };



    const deleteReward = async (rewardId) => {
      try {
        const token = await AsyncStorage.getItem('token_key');
        const headers = { 'Content-Type': 'application/json' };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.delete(`http://localhost:3000/api/delete-reward`, {
          withCredentials: true,
          headers: headers,
          data: { rewardID: rewardId }
        });

        if (response.status === 200) {
          setAllRewardsData([]);  // <-- Clear all rewards data
          fetchFamilyUsersAndTheirRewards();  // <-- Fetch the new set of rewards
        }
      } catch (error) {
        console.error("Error deleting reward:", error);
      }
  };

  const fetchFamilyUsersAndTheirRewards = async () => {
    try {
      // Step 1: Fetch family usernames from AsyncStorage
      const familyUsers = await AsyncStorage.getItem('familyUsers');
      let newRewardsData = [];
  
      if (familyUsers) {
        const parsedFamilyUsers = JSON.parse(familyUsers);
        console.log("---below is parsedFamilyUsers---")
        console.log(parsedFamilyUsers);
        // Step 2: Fetch rewards for each family username
        for (const Username of parsedFamilyUsers) {
          const userRewards = await fetchAndSyncRewards(Username.Username);
          console.log("---below is userRewards---")
          console.log(userRewards);
          newRewardsData = [...newRewardsData, ...userRewards];
        }
  
        // Removing duplicates from newRewardsData
        let rewardIdsSet = new Set();
        let uniqueRewards = [];
  
        newRewardsData.forEach(reward => {
          if (!rewardIdsSet.has(reward.RewardID)) {  // Use 'RewardID' instead of 'id'
            rewardIdsSet.add(reward.RewardID);
            uniqueRewards.push(reward);
          }
        });
        
  
        newRewardsData = uniqueRewards;
        console.log("---below is newRewardsData---")
        console.log(newRewardsData);  // Log the deduplicated rewards
        
        // Step 3: Compare new rewards data with current state
        if (JSON.stringify(newRewardsData) !== JSON.stringify(allRewardsData)) {
          setAllRewardsData(newRewardsData);
        }
      } else {
        console.warn("No family users found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching family users and their rewards:", error);
    }
  };
  
  
  const fetchAndSyncRewards = async (username) => {
    try {
      const token = await AsyncStorage.getItem('token_key');
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await axios.post(`http://localhost:3000/api/rewards`, 
        { username: username },
        {
          withCredentials: true,
          headers: headers,
        }
      );
      if (Array.isArray(response.data)) {
        console.log("---below is response.data---")
        console.log(response.data)
        return response.data;
      } else {
        console.error("Expected array, but received:", response.data);
        return [];
      }
    } catch (error) {
      console.error(`Error syncing data for username ${username}:`, error);
      return [];
    }
  };
  
  

    const postRewardData = async (data) => {
      try {
        const token = await AsyncStorage.getItem('token_key');
        
        const headers = {
          'Content-Type': 'application/json',
        };
    
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        console.log(data)
        const response = await axios.post('http://localhost:3000/api/add-reward', data, {
          withCredentials: true,
          headers: headers
        });
        
        console.log("Data posted successfully:", response.data);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    };
    
    const toggleUserSelection = (username) => {
      if (selectedUsers.includes(username)) {
        setSelectedUsers(prevUsers => prevUsers.filter(user => user !== username));
      } else {
        setSelectedUsers(prevUsers => [...prevUsers, username]);
      }
    };
    const addReward = async () => {
      try {
        // Convert selectedUsers array into a comma-separated string
        const usernamesString = selectedUsers.join(',');
    
        const postData = {
          usernames: usernamesString,
          reward: reward,
          score: score,
        };
    
        await postRewardData(postData);
        setRefreshData(true)
        setAllRewardsData([]);
        fetchFamilyUsersAndTheirRewards();
      } catch (error) {
        console.error("Error updating reward:", error);
      }
    };
    
    

    const renderIndicator = () => {
      return (
        <View style={styles.indicatorContainer}>
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      );
    };

    return (
      <ScrollView style={styles.scrollView}>
      <View>
        {renderIndicator()}

        <Text style={styles.dashboardTitle}>Set Rewards</Text>

        {userSuggestions && userSuggestions.length > 0 && (
          <View style={{ ...styles.suggestionsContainer, flexDirection: 'row', flexWrap: 'wrap' }}>
            {userSuggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index} 
                style={selectedUsers.includes(suggestion) ? styles.resetBtn : styles.resetBtnInactive}
                onPress={() => toggleUserSelection(suggestion)}
              >
                <Text style={styles.text}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
          <TextInput
            style={styles.rewardInput}
            placeholder="Score (e.g. 80)"
            value={score}
            onChangeText={setScore}
          />
          <TextInput
            style={styles.rewardInput}
            placeholder="Reward (e.g. New Toy)"
            value={reward}
            onChangeText={setReward}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.setRewardsButton}>
              <Button 
                title="Add Reward" 
                color={colors.primary} 
                onPress={addReward}
              />
            </View>
          </View>
  
          <FlatList
            data={allRewardsData}
            keyExtractor={(item, index) => item.RewardID + '-' + index}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardContent1}>
                  <View style={styles.textContainer}>
                    <Text style={styles.promiseRewardName}>{item.Reward}</Text>
                    <Text>Score: {item.Score}</Text> 
                    <Text>Username: {item.Username}</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.deleteBtn} 
                    onPress={() => deleteReward(item.RewardID)}
                  >
                    <Text style={{fontSize: 24, color: 'white', fontWeight: 600,}}>X</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    );
  };

  const colors = {
    primary: '#1960bd',
    white: 'white',
  };

  export default SetRewards;
