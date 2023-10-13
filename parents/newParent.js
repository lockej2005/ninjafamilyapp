import React, { useState, useEffect } from 'react';
import myStyles from '../styles';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import the navigation components

const generateInviteCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return code;
};

const styles = myStyles('parent');

const NewParent = () => {
    const [familyName, setFamilyName] = useState('');
    const [resetInterval, setResetInterval] = useState('Month'); // default to 'Month'
    const [inviteCode, setInviteCode] = useState('');
    const [generatedCode] = useState(generateInviteCode());
    const [username, setUsername] = useState('');
    const navigation = useNavigation(); // Get the navigation object

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const storedUsername = await AsyncStorage.getItem('username');
                if (storedUsername !== null) {
                    setUsername(storedUsername);
                }
            } catch (error) {
                console.error('Error fetching username from AsyncStorage:', error);
            }
        };

        fetchUsername();
    }, []);

    const createFamily = async () => {
        try {
            // Make a POST request to create a family
            const response = await fetch('http://localhost:3000/api/create-family', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    familyName,
                    resetInterval,
                    inviteCode: generatedCode,
                    username,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle success
                console.log('Family created successfully!', data);

                // Navigate to the Main page upon successful family creation
                navigation.navigate('ParentMain'); // Replace 'Main' with the name of your Main component screen
            } else {
                // Handle error
                console.error(data.message || 'Failed to create a family.');
            }
        } catch (error) {
            console.error('Error creating a family:', error);
        }
    };

    const joinFamily = async () => {
        try {
            // Make a POST request to your API endpoint to join the family
            const response = await fetch('http://localhost:3000/api/family-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the content type based on your API's requirements
                },
                credentials: 'include',
                body: JSON.stringify({ inviteCode }),
            });

            const data = await response.json();

            if (response.ok) {
                // Handle success, e.g., show a success message
                console.log('Joined the family successfully!', data);
                navigation.navigate('ParentMain')
            } else {
                // Handle error, e.g., show an error message
                console.error(data.message || 'Failed to join the family.');
            }
        } catch (error) {
            console.error('Error joining the family:', error);
        }
    };

    return (
        <View style={styles.container1}>
            <Text style={styles.title1}>Welcome, {username}!</Text>
            <Text>You've created a parent account but you need to join or create a family.</Text>
            <Text style={styles.sectionTitle1}>Create a Family</Text>
            <TextInput
                style={styles.input1}
                placeholder="Enter Family Name"
                value={familyName}
                onChangeText={setFamilyName}
            />
            <View style={styles.buttonContainer1}>
                <TouchableOpacity
                    style={resetInterval === 'Week' ? styles.buttonActive1 : styles.button1}
                    onPress={() => setResetInterval('Week')}>
                    <Text style={styles.buttonText1}>Reset Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={resetInterval === 'Month' ? styles.buttonActive1 : styles.button1}
                    onPress={() => setResetInterval('Month')}>
                    <Text style={styles.buttonText1}>Reset Monthly</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.inviteText1}>Invite Code: {generatedCode}</Text>
            <TouchableOpacity style={styles.submitButton1} onPress={createFamily}>
                <Text style={styles.submitButtonText1}>Create</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle1}>Join an Existing Family</Text>
            <TextInput
                style={styles.input1}
                placeholder="Enter Invite Code"
                value={inviteCode}
                onChangeText={setInviteCode}
            />
            <TouchableOpacity style={styles.submitButton1} onPress={joinFamily}>
                <Text style={styles.submitButtonText1}>Join</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NewParent;
