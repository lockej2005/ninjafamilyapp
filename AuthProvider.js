import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [isParent, setIsParent] = useState(true);  // <-- Add this state
  const isLoggedIn = Boolean(username); 

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername) {
          setUsername(storedUsername);
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };
    fetchUsername();
  }, []);

  const resetAuth = async () => {
    try {
      await AsyncStorage.removeItem('username');
      setUsername(null);
    } catch (error) {
      console.error('Error during resetAuth:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      username, 
      setUsername, 
      resetAuth, 
      isLoggedIn, 
      isParent,       // <-- Provide this value
      setIsParent     // <-- Provide this function
    }}>
      {children}
    </AuthContext.Provider>
  );
};
