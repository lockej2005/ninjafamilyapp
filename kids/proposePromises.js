import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getStyles from '../styles';
import { ScrollView } from 'react-native-gesture-handler';
import AuthContext from '../AuthContext';
import { DataContext, useData } from '../DataContext';

const proposeRewards = () => {
  const { username } = useContext(AuthContext);
  const { refreshData, setRefreshData } = useContext(DataContext); // Added refreshData
  const [reward, setReward] = useState('');
  const [allRewardsData, setAllRewardsData] = useState([]);
  
  const styles = getStyles('kid');

  const filterAndSortPromiseData = (data) => {
    const filteredPromiseData = data.filter(item => item.Status === 'Kid Req');
    const sortedPromiseData = filteredPromiseData.sort((a, b) => a.PromiseID - b.PromiseID);
    return sortedPromiseData;
  };

  const fetchPromiseData = async () => {
    try {
      let response = await fetch(`http://localhost:3000/api/user-promises?username=${username}`, {
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.status === 200) {
          const promiseData = await response.json();
          const sortedPromiseData = filterAndSortPromiseData(promiseData);
          setAllRewardsData(sortedPromiseData);
          setRefreshData(false); // Reset refreshData to false after fetching
      } else {
          console.error('Failed to fetch promise data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching promise data:', error);
    }
  };

  useEffect(() => {
    fetchPromiseData();
  }, [username, refreshData]);

  const handleAddPromise = async () => {
    try {
      const promiseData = {
        username: username,
        name: reward,
        recurrence: 'Never',
        RequestStatus: 'Pending',
        status: 'Kid Req'
      };

      const response = await fetch('http://localhost:3000/api/add-promise', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promiseData),
      });

      if (response.status === 201) {
        const newPromiseData = await response.json();
        const updatedRewardsData = [...allRewardsData, newPromiseData];
        const sortedAndFilteredRewardsData = filterAndSortPromiseData(updatedRewardsData);
        setAllRewardsData(sortedAndFilteredRewardsData);
        setReward('');
        setRefreshData(true); // Set refreshData to true when a new promise is added
      } else {
        console.error('Failed to add promise:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding promise:', error);
    }
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
  
  return (
    <ScrollView style={styles.scrollView}>
      <View>
      {renderIndicator()}
        <Text style={styles.dashboardTitle}>Propose Promises</Text>
        <TextInput
          style={styles.rewardInput1}
          placeholder="Promise (e.g. Clean up the bathroom)"
          value={reward}
          onChangeText={setReward}
          underlineColor="transparent"
          multiline
          numberOfLines={4}
        />
        <View style={{  padding: 15 }}>
        <Text style={{ color:'grey', textAlign: 'center', }}>Proposed Promises will be sent to the Parents for approval, if approved the promise will be worth 1.5x towards </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.setRewardsButton}>
            <Button
              title="Add Promise"
              color={colors.primary}
              onPress={handleAddPromise}
            />
          </View>
        </View>
        <FlatList
            data={allRewardsData}
            keyExtractor={(item) => item.PromiseID}
            renderItem={({ item }) => (
                <View key={item?.PromiseID?.toString()} style={styles.card}>
                <View style={styles.cardContent}>
                    <Text style={styles.promiseRewardName}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: 'grey' }}>Awaiting Parent Approval...</Text>
                </View>
                </View>
            )}
        />
      </View>
    </ScrollView>
  );
};

const colors = {
  primary: '#7f32a8',
  white: 'white',
};

export default proposeRewards;
