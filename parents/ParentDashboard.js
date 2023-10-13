import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../AuthContext';
import { CommonActions } from '@react-navigation/native';
import { View, ScrollView, StyleSheet, Text, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import { DataContext, useData } from '../DataContext';

import getStyles from '../styles';
const styles = getStyles('parent');
const userProfiles = {
  'solider.png': require('../profilepic/solider.png'),
  'mafiaboss.png': require('../profilepic/mafiaboss.png'),
  'princess.png': require('../profilepic/princess.png'),
  'ninja.png': require('../profilepic/ninja.png'),
};

const ParentDashboard = ({ navigation }) => {
  console.log('hello')
  const { username, setUsername, resetAuth } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const {
    allPromises, setAllPromises, refreshData, setRefreshData, userData, setUserData, kidsUsernames, setKidsUsernames
  } = useContext(DataContext);

  const handlePromiseAccept = async (promiseId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/update-promise-status`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promiseID: promiseId,
          status: "Outgoing"
        })
      });

      if (response.ok) {
        setMessage({ text: 'Promise accepted!', color: '#30bf3e' });
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setRefreshData(true);
      }
    } catch (error) {
      console.error("Error updating promise status:", error);
    }
  };

  const handlePromiseDelete = async (promiseId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/update-promise-status`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          promiseID: promiseId,
          status: "Delete"
        })
      });

      if (response.ok) {
        setMessage({ text: 'Promise Deleted!', color: '#b01a1a'});
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        setRefreshData(true);
      }
    } catch (error) {
      console.error("Error updating promise status:", error);
    }
  };

  const fetchData = async () => {
    console.log(username);
    if (!username) return;
    
    let response = await fetch(`http://localhost:3000/api/user-details?username=${username}`, {
      method: 'GET', 
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      }
    });
    let userDetails = await response.json();
    const familyId = userDetails[0].FamilyID;
    await AsyncStorage.setItem('familyID', familyId);
    if (!familyId) {
        console.error('No FamilyID found');
        return;
    }

    response = await fetch(`http://localhost:3000/api/family-members?familyID=${familyId}`, {
      method: 'GET', 
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json',
      }
    });

    let familyMembers = await response.json();
    AsyncStorage.setItem('familyUsers', JSON.stringify(familyMembers));

    const rewardsRequests = familyMembers.map(member => 
      fetch(`http://localhost:3000/api/user-rewards?username=${member.Username}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json',
          }
      }),
    );

    const promisesRequests = familyMembers.map(member => 
      fetch(`http://localhost:3000/api/user-promises?username=${member.Username}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        }
      }),
    );

    const rewardsDataArrays = await Promise.all(rewardsRequests.map(async (request, i) => {
      const response = await request;
      const data = await response.json();
      return data.map(reward => ({
          ...reward,
          associatedUsername: familyMembers[i].Username
      }));
    }));

    const promisesDataArrays = await Promise.all(promisesRequests.map(async (request, i) => {
      const response = await request;
      const data = await response.json();
      return data.filter(promise => promise.Status === "Kid Req").map(promise => ({
        ...promise,
        associatedUsername: familyMembers[i].Username
      }));
    }));
    console.log(promisesDataArrays)
    setAllPromises(promisesDataArrays.flat());

    const rewardsData = [].concat(...rewardsDataArrays);

    let mergedUserData = familyMembers.map(member => {
      let memberRewards = rewardsData.filter(data => data.associatedUsername === member.Username);
      let memberPromises = promisesDataArrays.flat().filter(promise => promise.associatedUsername === member.Username);
      return {
        ...member,
        rewards: memberRewards,
        promises: memberPromises
      };
    });

    let kidsOnly = mergedUserData.filter(user => user.user_type === 'kid');
    console.log(kidsOnly)
    const kUseranmes = kidsOnly.map(kid => kid.Username);
    setKidsUsernames(kUseranmes);
    setUserData(kidsOnly);
    setRefreshData(false);
  };

  useEffect(() => {
    let isMounted = true;  
    fetchData();

    const fetchRewardsFromStorage = async () => {
      try {
          const jsonString = await AsyncStorage.getItem('rewards');
          if (jsonString && isMounted) {
              setRewards(JSON.parse(jsonString)); 
          }
      } catch (error) {
          console.error("Error fetching rewards from storage: ", error);
      }
    };

    fetchRewardsFromStorage();

    if (refreshData) {
        fetchData();
    }

    return () => { isMounted = false; }   
  }, [username, refreshData]);

  const handleLogout = async () => {
    try {
      // Clear all data from AsyncStorage.
      await AsyncStorage.clear();
      
      // Reset user details in the AuthContext and any other states as needed.
      resetAuth(); 

      // Reset other states/data if necessary.
      resetData();  

      // Redirect the user back to the Login screen.
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Login' },
          ],
        })
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
};


  const resetData = useData().resetData;


  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  
  const displayUnlockedRewards = (child) => {
    if (!child.rewards) return null;  
  
    return child.rewards
      .sort((a, b) => a.Score - b.Score) 
      .map((rewardItem, index) => {
        return (
          <Paragraph
            style={[
              styles.checkpointReward,
              child.PromiseScore >= rewardItem.Score ? styles.boldText : null
            ]}
            key={index}
          >
            {rewardItem.Reward} unlocked at {rewardItem.Score}.
          </Paragraph>
        );
      });
  };
  const renderMessage = () => {
    if (!message) return null;
    return (
      <Text style={{ color: message.color, marginBottom: 10, textAlign: 'center', fontWeight: '800', fontFamily: 'INTER_400REGULAR' }}>
        {message.text}
      </Text>
    );
  };
  
    const renderIndicator = () => {
      return (
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.indicatorActive]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>
      );
    };
    const handleUserClick = (user) => {
      const userPromises = allPromises.filter(promise => promise.associatedUsername === user.Username);
      navigation.navigate('UserProfile', { user: user, userType: 'parent' });
  };
  
  const displayPromises = () => {
    return allPromises.map((promiseItem, index) => (
        <Card key={index} style={styles.promiseCard}>
            <Card.Content style={styles.promiseCardContent}>
              <View style={{ width: '60%' }}>
                <Paragraph style={styles.boldText}>{promiseItem.name}</Paragraph>
                <Paragraph>{promiseItem.Username}</Paragraph>
                </View>
                <View style={styles.positionCont}>
                <Button 
                    style={styles.tickBox} 
                    onPress={() => handlePromiseAccept(promiseItem.PromiseID)}>
                    <Text style={{ color: '#30bf3e', fontFamily: 'Inter_700Bold', fontSize: 24, fontWeight: '800', padding: 5 }}>✓</Text>
                </Button>
                <Button 
                    style={styles.xBox} 
                    onPress={() => handlePromiseDelete(promiseItem.PromiseID)}>
                    <Text style={{ color: '#b01a1a', fontFamily: 'Inter_700Bold', fontSize: 24, fontWeight: '800', padding: 5 }}>✗</Text>
                </Button>
                </View>
            </Card.Content>

        </Card>
    ));
};


    return (
      <ScrollView style={styles.scrollView}>
      {renderIndicator()}
      <View style={styles.header}>
          <Title style={styles.dashboardTitle}>Welcome {username}</Title>
          
          <View>
          <Image source={'solider.png'}></Image>
          </View>
          <View style={styles.buttonContainer}>
              <Button mode="contained" style={styles.setRewardsButton} onPress={handleLogout}>Logout</Button>
          </View>
      </View>

      {userData.map((child, index) => (
    <Card style={styles.card} key={index} onPress={() => handleUserClick(child)}>
        <Card.Content style={styles.cardContent}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title style={styles.childName}>{child.Name}</Title>
                <Image source={userProfiles[child.ProfilePic]} style={styles.profileIcon} />
            </View>
            <Paragraph style={styles.promiseScore}>Promise Score: {child.PromiseScore}</Paragraph>
            <View style={styles.barContainer}>
                <View style={[styles.promiseScoreLine, { width: `${child.PromiseScore}%` }]}></View>
            </View>
            {displayUnlockedRewards(child)}
        </Card.Content>
    </Card>
))}
      <View style={styles.promisesContainer}>
        <Title style={styles.promisesTitle}>Promise Proposals</Title>
        {renderMessage()}
        {displayPromises()}
      </View>


      </ScrollView>
    );
  };

  const colors = {
    primary: '#7f32a8',
    white: 'white',
  };

  export default ParentDashboard;