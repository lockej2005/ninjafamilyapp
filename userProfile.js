import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Paragraph, Button } from 'react-native-paper';
import getStyles from './styles';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from './DataContext';
import PromisesSection from './parents/components/PromiseDisplay';

const profileImages = {
    'solider.png': require('./profilepic/solider.png'),
    'mafiaboss.png': require('./profilepic/mafiaboss.png'),
    'princess.png': require('./profilepic/princess.png'),
    'ninja.png': require('./profilepic/ninja.png'),
    'skatergirl.png': require('./profilepic/skatergirl.png'),
};

const UserProfile = ({ navigation, route }) => {
    const { user: routeUser, userType } = route.params;
    const styles = getStyles(userType);
    const { userData, refreshData, setRefreshData } = useContext(DataContext)
    console.log(userData)
    const user = userData.find(u => u.Username === routeUser.Username) || routeUser;
    console.log(user)

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.mainContainer}>
              <View style={styles.headerRow}>
                <View style={styles.subRow}>
                    <Text style={styles.profileTitle}>{user.Name}'s Profile</Text>
                    <View style={styles.userInfo}>
                        <Text style={styles.infoLabel}>{user.PromiseScore}</Text>
                    </View>
                </View>

                <View style={styles.subRow}>
                    <Image source={profileImages[user.ProfilePic]} style={styles.profileImage} />
                </View>
              </View>
              
              <TouchableOpacity style={styles.setRewardsButton} onPress={() => navigation.navigate('ParentMain')}>
                  <Text style={styles.buttonText}>Back</Text>
              </TouchableOpacity>
            </View>
              <PromisesSection usernames={[ user.Username ]}/>
        </ScrollView>
    );
};

export default UserProfile;
