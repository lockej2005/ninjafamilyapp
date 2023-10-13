import React, { useState, useEffect, useContext } from 'react';  // Import useEffect
import { useIsFocused } from '@react-navigation/native';
import PromisesSection from './components/PromiseDisplay.js'; // Assuming they're in the same directory

import { View, Text, TextInput, Button, TouchableOpacity, AsyncStorage } from 'react-native';  // Import AsyncStorage
import getStyles from '../styles';
import { DataContext, useData } from '../DataContext';  // Import the useData hook

const addPromise = ({ navigation }) => {
    const [selectedUser, setSelectedUser] = useState('');
    const [promise, setPromise] = useState('');
    const [selectedResetOption, setSelectedResetOption] = useState('Never');
    const [message, setMessage] = useState({ text: '', type: 'success' });
    const {kidsUsernames, setKidsUsernames, setRefreshData} = useContext(DataContext);
    const [ selectedUsers, setSelectedUsers ] = useState([])
    const isFocused = useIsFocused();

    const styles = getStyles('parent');
    console.log(kidsUsernames)

    // Destructure promises and setPromises from the context
    const { promises, setPromises } = useData();

    const handleSavePromise = async () => {
        console.log('handleSavePromise')
        try {
            console.log('trying...')

            console.log('doing request body')
            const requestBody = {
                username: selectedUsers.join(','),  // <-- Converts array to comma-separated string
                status: 'Outgoing',
                name: promise,
                recurrence: selectedResetOption,
            };
            
            console.log(requestBody);
            
            const response = await fetch('http://localhost:3000/api/add-promise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                credentials: 'include'
            });
            

            const data = await response.json();

            if (response.ok) {
                // Update the promises in context when successfully added
                console.log(promises)
                
                setPromises(prevPromises => [...prevPromises, requestBody]);
                setMessage({ text: "Promise added successfully.", type: 'success' });
                setRefreshData(true);

            } else {
                setMessage({ text: data.message || "Could not add the promise. Contact Support if error keeps happening.", type: 'error' });
            }

        } catch (error) {
            setMessage({ text: "Something went wrong while adding the promise.", type: 'error' });
        }
    };
    const toggleUserSelection = (username) => {
        if (selectedUsers.includes(username)) {
            setSelectedUsers(prevUsers => prevUsers.filter(user => user !== username));
        } else {
            setSelectedUsers(prevUsers => [...prevUsers, username]);
        }
    };
    
    const renderIndicator = () => {
        return (
            <View style={styles.indicatorContainer}>
                <View style={styles.indicator} />
                <View style={styles.indicator} />
                <View style={[styles.indicator, styles.indicatorActive]} />
                <View style={styles.indicator} />
            </View>
        );
    };

    return (
    <View>
        <View style={styles.container}>
            {renderIndicator()}
            <Text style={styles.dashboardTitle}>Add Promises</Text>
            <View style={{ ...styles.suggestionsContainer, flexDirection: 'row', flexWrap: 'wrap' }}>
        {kidsUsernames.map((suggestion, index) => (
            <TouchableOpacity 
                key={index} 
                style={selectedUsers.includes(suggestion) ? styles.resetBtn : styles.resetBtnInactive}
                onPress={() => toggleUserSelection(suggestion)}
            >
                <Text style={styles.text}>{suggestion}</Text>
            </TouchableOpacity>
         ))}
        </View>

            <TextInput
                style={styles.rewardInput1}
                value={promise}
                onChangeText={setPromise}
                placeholder="Enter Promise (e.g. Take the bins out every Monday)"
                multiline={true}
                scrollEnabled={true}
            />
            <Text style={styles.labelTitle}>How often do you want this promise to recur?</Text>
            <View style={styles.resetSelector}>
                <TouchableOpacity
                    style={selectedResetOption === 'Never' ? styles.resetBtn : styles.resetBtnInactive}
                    onPress={() => setSelectedResetOption('Never')}>
                    <Text style={styles.text}>Never</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={selectedResetOption === 'Daily' ? styles.resetBtn : styles.resetBtnInactive}
                    onPress={() => setSelectedResetOption('Daily')}>
                    <Text style={styles.text}>Daily</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={selectedResetOption === 'Weekly' ? styles.resetBtn : styles.resetBtnInactive}
                    onPress={() => setSelectedResetOption('Weekly')}>
                    <Text style={styles.text}>Weekly</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.setRewardsButton}>
                    <Button
                        title="Add Promise"
                        color={'#1960bd'}
                        onPress={handleSavePromise}
                    />
                </View>
            </View>
            <Text style={{fontWeight: 800, fontFamily: 'Inter_400Regular', color: message.type === 'success' ? 'green' : 'red' }}>{message.text}</Text>
        </View>
        {kidsUsernames && kidsUsernames.length > 0 && <PromisesSection usernames={kidsUsernames}/>}
        </View>
    );
};

export default addPromise;
