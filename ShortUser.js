import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import getStyles from './styles';

const userProfiles = {
  'solider.png': require('./profilepic/solider.png'),
  'mafiaboss.png': require('./profilepic/mafiaboss.png'),
  'princess.png': require('./profilepic/princess.png'),
  'ninja.png': require('./profilepic/ninja.png'),
  // Add more user profiles here
};

const samplePromises = [
  { id: 1, userId: 1, name: 'The fitness gram pacer test is a mult stage pacer test that tests', dueDate: '2023-08-15', status: 'active' },
  { id: 2, userId: 1, name: 'Josh', dueDate: '2023-08-10', status: 'active' },
  { id: 3, userId: 1, name: 'Help with Chores', dueDate: '2023-08-12', status: 'failed' },
  // Add more sample promises here
];

const ShortUser = ({ navigation, route }) => {
  const { user } = route.params;
  console.log(user)
  const userType = 'parent'; // Change this to the actual user type
  const styles = getStyles(userType);

  const userPromises = samplePromises.filter(promise => promise.userId === user.userId);

  const userName = user.name;
  const userPromiseScore = user.promiseScore;
  const userReward = user.reward;

  const [activeTab, setActiveTab] = useState('outgoing');

  const outgoingPromises = userPromises.filter(promise => promise.status === 'active');
  const keptPromises = userPromises.filter(promise => promise.status === 'kept');
  const failedPromises = userPromises.filter(promise => promise.status === 'failed');

  const renderPromises = promises => {
    return promises.map(promise => {
      const userProfile = userProfiles[user.profilePic];
      
      return (
        <Card style={styles.promiseCard} key={promise.id}>
          <Card.Content style={styles.cardContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Paragraph style={styles.promiseName}>{promise.name}</Paragraph>
            </View>
            <Paragraph style={styles.promiseDueDate}>Due Date: {promise.dueDate}</Paragraph>
          </Card.Content>
          {/* ... (rest of the card content) */}
        </Card>
      );
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.mainContainer}>
        <View style={styles.promiseCardContent}>
        <Text style={styles.title}>{userName}'s Promises</Text>
        <Image source={userProfiles[user.profilePic]} style={styles.profileIcon} />
        </View>
        <View style={styles.promiseSection}>
          {activeTab === 'outgoing' && renderPromises(outgoingPromises)}
          {activeTab === 'kept' && renderPromises(keptPromises)}
          {activeTab === 'failed' && renderPromises(failedPromises)}
        </View>
      </View>
      <TouchableOpacity style={styles.setRewardsButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default ShortUser;
