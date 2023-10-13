import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { Card, Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import axios from 'axios';
import getStyles from '../styles';
import { DataContext, useData } from '../DataContext';
import AuthContext from '../AuthContext';

const styles = getStyles('kid');

const KidsDashboard = ({ navigation }) => {
  const {
    rewards,
    setRewards,
    outgoingPromises,
    setOutgoingPromises,
    strikes,
    setStrikes,
    keptPromises,
    setKeptPromises,
    brokenPromises,
    setBrokenPromises,
    activeSection,
    setActiveSection,
    refreshData,
    promises, 
    setPromises,
    loggedUser,
    setLoggedUser
  } = useData();

  const [newPromise, setNewPromise] = useState('');
  const [promiseScore, setPromiseScore] = useState(0);
  const { username, setUsername, resetAuth } = useContext(AuthContext);

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const fetchData = async (usernameToUse) => {
    try {
      const response = await fetch(`http://localhost:3000/api/user-details?username=${usernameToUse}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userDetails = await response.json();
      console.log(userDetails)
      if (userDetails && userDetails.length > 0) {
        console.log(userDetails[0])
        setLoggedUser(userDetails[0]);
        // Storing familyID in AsyncStorage
        console.log(userDetails[0].FamilyID.toString())
        await AsyncStorage.setItem('familyID', userDetails[0].FamilyID.toString());
      } else {
        console.error('No user details found.');
      }

      const rewardsResponse = await fetch(`http://localhost:3000/api/user-rewards?username=${usernameToUse}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const userRewards = (await rewardsResponse.json()).sort((a, b) => a.Score - b.Score);
      setRewards(userRewards);
      
      setRewards(userRewards);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


    useEffect(() => {
      const fetchInitialData = async () => {
        try {
          if (username) {
            setUsername(username);
            fetchData(username);
          }
        } catch (error) {
          console.error('Failed to get stored username.', error);
        }      };
  
      fetchInitialData();
  }, [refreshData]);
  
  useEffect(() => {
      if (loggedUser) {
        fetchUserPromises();
      }
  }, [loggedUser]);
  

  const fetchUserPromises = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user-promises?username=${loggedUser.Username}`, { credentials: 'include' });
      const userPromises = await response.json();
  
      // Filter promises based on their Status
      const outgoing = userPromises.filter(promise => promise.Status === "Outgoing");
      const kept = userPromises.filter(promise => promise.Status === "Kept");
      const failed = userPromises.filter(promise => promise.Status === "Failed");
  
      // Set state for each section
      setOutgoingPromises(outgoing);
      setKeptPromises(kept);
      setBrokenPromises(failed);
  
    } catch (error) {
      console.error('Error fetching user promises:', error);
    }
  };
  const extractDate = (datetime) => {
    const date = new Date(datetime);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}


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

const displayUnlockedRewards = () => {
  return rewards.map((rewardItem, index) => {
    const isUnlocked = loggedUser.PromiseScore >= rewardItem.Score;
    return (
      <Paragraph
        style={[
          styles.checkpointReward,
          isUnlocked ? styles.purpleText : null,
        ]}
        key={index}
      >
        {rewardItem.Reward} unlocked at {rewardItem.Score}.
      </Paragraph>
    );
  });
};

  const renderIndicator = () => {
    return (
      <View style={styles.indicatorContainer}>
        <View style={[styles.indicator, styles.indicatorActive]} />
        <View style={styles.indicator} />
        <View style={styles.indicator} />
      </View>
    );
  };
  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
      {renderIndicator()}
        <View style={styles.header}>
          <Text style={styles.dashboardTitle}>
            Welcome {loggedUser.Username}
          </Text>
          <Button
            mode="contained"
            style={styles.setRewardsButton}
            onPress={handleLogout}
          >
            <Text>Logout</Text>
          </Button>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Paragraph style={styles.reward}>
            {loggedUser.PromiseScore}
          </Paragraph>
          <Card style={styles.card}>
          {loggedUser && loggedUser.ProfilePic && (
    <Image 
        source={require(`../profilepic/${loggedUser.ProfilePic}`)} 
        style={{ width: 100, height: 100 }} 
    />
)}

          </Card>
        </View>
        <View style={styles.barContainer}>
          <View
            style={[
              styles.promiseScoreLine,
              { width: `${loggedUser.PromiseScore}%` },
            ]}
          ></View>
        </View>
        <View style={styles.rewardContent}>
          {displayUnlockedRewards()}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          <Button onPress={() => setActiveSection('Outgoing')}>
            <Text
              style={[
                styles.outgoingText,
                activeSection === 'Outgoing'
                  ? styles.activeSection
                  : styles.inactiveSection,
              ]}
            >
              Outgoing
            </Text>
          </Button>
          <Button onPress={() => setActiveSection('Kept')}>
            <Text
              style={[
                styles.keptText,
                activeSection === 'Kept'
                  ? styles.activeSection
                  : styles.inactiveSection,
              ]}
            >
              Kept
            </Text>
          </Button>
          <Button onPress={() => setActiveSection('Broken')}>
            <Text
              style={[
                styles.brokenText,
                activeSection === 'Broken'
                  ? styles.activeSection
                  : styles.inactiveSection,
              ]}
            >
              Broken
            </Text>
          </Button>
        </View>
        {activeSection === 'Outgoing' && (
    <View>
      {outgoingPromises.map((promise) => (
          <Card key={promise.PromiseID} style={styles.smallCard}>
              <Card.Content style={styles.promiseCardContent}>
                  <Text style={styles.title}>{promise.name}</Text>
                  <View style={styles.strikesContainer}>
                      <Text style={[styles.strike, promise.Strikes >= 1 && styles.redStrike]}>X</Text>
                      <Text style={[styles.strike, promise.Strikes >= 2 && styles.redStrike]}>X</Text>
                      <Text style={[styles.strike, promise.Strikes >= 3 && styles.redStrike]}>X</Text>
                  </View>

              </Card.Content>
              <Text style={{ fontSize: 14, color: 'grey', textAlign: 'center', padding: 5 }}>Promise created at {extractDate(promise.UpdateDate)}</Text>

          </Card>
      ))}

    </View>
)}

        {activeSection === 'Kept' && (
          <View>
            <ScrollView>
          {keptPromises.map((promise) => (
            <Card key={promise.PromiseID} style={styles.smallCard}>
                <Card.Content style={styles.promiseCardContent}>
                    <Text style={styles.title}>{promise.name}</Text>
                </Card.Content>
                <Text style={{ fontSize: 14, color: 'grey', textAlign: 'center', padding: 5 }}>Promise kept at {extractDate(promise.UpdateDate)}</Text>
            </Card>
        ))}
            </ScrollView>
          </View>
        )}
        {activeSection === 'Broken' && (
          <View>
            <ScrollView>
                    {brokenPromises.map((promise) => (
            <Card key={promise.PromiseID} style={styles.smallCard}>
                <Card.Content style={styles.promiseCardContent}>
                    <Text style={styles.title}>{promise.name}</Text>
                </Card.Content>
                <Text style={{ fontSize: 14, color: 'grey', textAlign: 'center', padding: 5 }}>Promise Broken at {extractDate(promise.UpdateDate)}</Text>
            </Card>
        ))}

            </ScrollView>
          </View>
        )}
      </View>

    </ScrollView>
  );
};

export default KidsDashboard;
