import React, { useState, useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../AuthContext';
import { DataContext, useData } from '../../DataContext';

// Assuming you have styles defined/imported here
import getStyles from '../../styles';
const styles = getStyles('parent');

const PromisesSection = ({ usernames }) => {
const { username, setUsername, resetAuth } = useContext(AuthContext);
const [isLoading, setIsLoading] = useState(true);
const { 
    promises, setPromises, userScores, setUserScores, rewards, setRewards,
    activeSection, setActiveSection, strikes, setStrikes, outgoingPromises,
    setOutgoingPromises, keptPromises, setKeptPromises, brokenPromises, 
    setBrokenPromises, userData, setUserData, allPromises, setAllPromises, 
    refreshData, setRefreshData 
  } = useContext(DataContext);

  const fetchData = async () => {
    console.log('hello test 123')
    console.log(username)
    
    try {
        if (!username) return;

        // Fetch the stored familyUsers data
        const familyUsersJSON = await AsyncStorage.getItem('familyUsers');

        // If there's no data, exit early
        if (!familyUsersJSON) return;

        // Parse the JSON string to obtain the array
        const familyMembers = JSON.parse(familyUsersJSON);

        // Assuming you still want to fetch user details, keep this part:
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

        // If you still need rewards data fetching, keep this part:
        const rewardsRequests = familyMembers.map(member => 
            fetch(`http://localhost:3000/api/user-rewards?username=${member.Username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        );

        const rewardsDataArrays = await Promise.all(rewardsRequests.map(async (request, i) => {
            const response = await request;
            const data = await response.json();
            return data.map(reward => ({
                ...reward,
                associatedUsername: familyMembers[i].Username
            }));
        }));

        AsyncStorage.setItem('rewardsDataArrays', JSON.stringify(rewardsDataArrays));

        const rewardsData = [].concat(...rewardsDataArrays);

        // Now, utilize the familyMembers array for promises requests
        const promisesRequests = usernames.map(username => 
            fetch(`http://localhost:3000/api/user-promises?username=${username}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        );
    
        const promisesDataArrays = await Promise.all(promisesRequests.map(async (request, i) => {
            const response = await request;
            const data = await response.json();
            return data.map(promise => ({
                ...promise,
                associatedUsername: usernames[i]
            }));
        }));
        console.log(promisesDataArrays);

        let allPromises = [].concat(...promisesDataArrays);
        AsyncStorage.setItem('promisesDataArrays', JSON.stringify(promisesDataArrays));

        const outgoing = allPromises.filter(promise => promise.Status === 'Outgoing');
        const kept = allPromises.filter(promise => promise.Status === 'Kept');
        const broken = allPromises.filter(promise => promise.Status === 'Failed');
        console.log(outgoing)
        console.log(outgoing)
        setOutgoingPromises(outgoing);
        setKeptPromises(kept);
        setBrokenPromises(broken);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}
const handleStrike = async (username, promiseID) => {
    let currentStrikes = strikes[promiseID] || 0;
    currentStrikes += 1;

    let status = currentStrikes === 3 ? 'Failed' : 'Outgoing';

    // If the status is failed, optimistically update the state
    if(status === 'Failed') {
      setOutgoingPromises(prev => prev.filter(promise => promise.PromiseID !== promiseID));
      setBrokenPromises(prev => [...prev, allPromises.find(promise => promise.PromiseID === promiseID)]);
    }
    
    try {
        await fetch(`http://localhost:3000/api/update-promise-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promiseID, status })
        });
    } catch (error) {
        console.error("Error updating promise status:", error);
    }

    // Calculate the new promiseScore
    let newPromiseScore = await calculateNewPromiseScore(username, currentStrikes === 3 ? -10 : -2);

    // Update the promiseScore on the server
    try {
        await fetch(`http://localhost:3000/api/update-promise-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, promiseScore: newPromiseScore })
        });
          setRefreshData(prev => !prev);
    } catch (error) {
        console.error("Error updating promise score:", error);
    }

    setStrikes(prevStrikes => ({ ...prevStrikes, [promiseID]: currentStrikes }));
};

const handleKept = async (username, promiseID) => {
    // Optimistic Update
    setOutgoingPromises(prev => prev.filter(promise => promise.PromiseID !== promiseID));
    setKeptPromises(prev => [...prev, allPromises.find(promise => promise.PromiseID === promiseID)]);
    
    try {
        await fetch(`http://localhost:3000/api/update-promise-status`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promiseID, status: 'Kept' })
        });
    } catch (error) {
        console.error("Error updating promise status:", error);
    }
  
    // Calculate the new promiseScore
    let newPromiseScore = await calculateNewPromiseScore(username, 10);
  
    // Update the promiseScore on the server
    try {
        await fetch(`http://localhost:3000/api/update-promise-score`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, promiseScore: newPromiseScore })

        });

    } catch (error) {
        console.error("Error updating promise score:", error);
    }
        setRefreshData(true);
  };
const calculateNewPromiseScore = async (username, adjustment) => {
    let response = await fetch(`http://localhost:3000/api/get-promise-score?username=${username}`);
    let currentScore = await response.json();
    let routeUser = 1
    console.log('this is current score' + currentScore)
    console.log(userData)
    setUserData(prevData => {
        return prevData.map(user => {
          if (user.Username === username) {
            return { ...user, PromiseScore: currentScore };
          }
          return user;
        });
      });
      console.log(userData)
    return currentScore + adjustment;

};
useEffect(() => {
    fetchData();
    setRefreshData(false);
}, [refreshData]);


  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10, marginBottom: 10 }}>
        <Button onPress={() => setActiveSection('Outgoing')}>
          <Text style={[styles.outgoingText, activeSection === 'Outgoing' ? styles.activeSection : styles.inactiveSection]}>Outgoing</Text>
        </Button>
        <Button onPress={() => setActiveSection('Kept')}>
          <Text style={[styles.keptText, activeSection === 'Kept' ? styles.activeSection : styles.inactiveSection]}>Kept</Text>
        </Button>
        <Button onPress={() => setActiveSection('Broken')}>
          <Text style={[styles.brokenText, activeSection === 'Broken' ? styles.activeSection : styles.inactiveSection]}>Broken</Text>
        </Button>
      </View>
      {activeSection === 'Outgoing' && outgoingPromises
    .filter(promise => usernames.includes(promise.associatedUsername))
    .map(promise => (
    <Card style={styles.promiseCard} key={promise.PromiseID}>
      <View style={{ flexDirection: 'column', display: 'flex', padding: 10, }}>
       <View style={{ flexDirection: 'row', display: 'flex', flex: 1 }}>
        <Card.Content style={styles.promiseCardContent}>
            <Paragraph style={styles.promiseName}>{promise.name}</Paragraph>
            <Paragraph style={styles.promiseDueDate}>{promise.dueDate}</Paragraph>
        </Card.Content>

        <Card.Content style={{ alignSelf: 'center', flexDirection: 'column', display: 'flex', alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', display: 'flex' }}>
            {[...Array(3)].map((_, strikeIndex) => (
                <Text key={strikeIndex} style={[styles.strike, strikeIndex < (strikes[promise.PromiseID] || 0) ? styles.activeStrike : {}]}>X</Text>
            ))}
            </View>
            <Text>{promise.associatedUsername}</Text>
        </Card.Content>
        </View> 
        <Card.Content style={styles.actionButtonContainer}>
            <View style={styles.buttonRow}>
                <View style={styles.buttonContainer1}>
                <Button
                    style={styles.tickBox} 
                    onPress={() => handleKept(promise.Username, promise.PromiseID)}>
                    <Text style={{ color: '#30bf3e', fontFamily: 'Inter_700Bold', fontSize: 24, fontWeight: '800', padding: 5 }}>✓</Text>
                </Button>
                </View>
                <View style={styles.buttonContainer1}>
                <Button 
                    style={styles.xBox} 
                    onPress={() => handleStrike(promise.Username, promise.PromiseID)} >
                    <Text style={{ color: '#b01a1a', fontFamily: 'Inter_700Bold', fontSize: 24, fontWeight: '800', padding: 5 }}>✗</Text>
                </Button>
                </View>
            </View>     
            </Card.Content>
        </View> 
    </Card>

        ))}
{activeSection === 'Kept' && keptPromises
    .filter(promise => usernames.includes(promise.associatedUsername))
    .map(promise => (
          <Card style={styles.smallCard} key={promise.PromiseID}>
            <Card.Content style={styles.promiseCardContent}>
            <Paragraph style={styles.promiseName}>{promise.name}</Paragraph>
              <Paragraph style={styles.promiseAction}>{promise.promise}</Paragraph>
            </Card.Content>
          </Card>
        ))}

{activeSection === 'Broken' && brokenPromises
    .filter(promise => usernames.includes(promise.associatedUsername))
    .map(promise => (
          <Card style={styles.smallCard} key={promise.PromiseID}>
            <Card.Content style={styles.promiseCardContent}>
            <Paragraph style={styles.promiseName}>{promise.name}</Paragraph>
              <Paragraph style={styles.promiseAction}>{promise.promise}</Paragraph>
            </Card.Content>
          </Card>
        ))}
    </View>
  );
};

export default PromisesSection;
