import React, { useContext, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import ParentDashboard from './parents/ParentDashboard';
import SetRewards from './parents/setRewards';
import KidsDashboard from './kids/KidsDashboard';
import Login from './login';
import Register from './register';
import OurFamily from './parents/ourFamily';
import UserProfile from './userProfile';
import ShortUser from './ShortUser';
import proposeRewards from './kids/proposePromises';
import kidsFamily from './kids/kidsFamily';
import newParent from './parents/newParent';
import addPromise from './parents/addPromise';

import { DataProvider } from './DataContext';
import AuthContext from './AuthContext';
import { AuthProvider } from './AuthProvider';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const ParentTabNavigator = () => {
  console.log("Initializing ParentTabNavigator");

  return (
    <Tab.Navigator initialRouteName="ParentDashboard" tabBar={() => null}>
      <Tab.Screen name="SetRewards" component={SetRewards} />
      <Tab.Screen name="ParentDashboard" component={ParentDashboard} />
      <Tab.Screen name="addPromise" component={addPromise} />
      <Tab.Screen name="OurFamily" component={OurFamily} />
    </Tab.Navigator>
  );
};

const KidTabNavigator = () => {
  console.log("Initializing KidTabNavigator");

  return (
    <Tab.Navigator initialRouteName="KidsDashboard" tabBar={() => null}>
      <Tab.Screen name="KidsDashboard" component={KidsDashboard} />
      <Tab.Screen name="proposeRewards" component={proposeRewards} />
      <Tab.Screen name="kidsFamily" component={kidsFamily} />
    </Tab.Navigator>
  );
};

const App = () => {
  const { isLoggedIn, isParent } = useContext(AuthContext);
  const navigationRef = useRef();

  useEffect(() => {
    if (!isLoggedIn) {
      navigationRef.current?.navigate('Login');
    } else if (isParent) {
      navigationRef.current?.navigate('ParentMain');
    } else {
      navigationRef.current?.navigate('KidMain');
    }
  }, [isLoggedIn, isParent]);

  return (
    <NavigationContainer ref={navigationRef} onStateChange={(state) => console.log('New state:', state)}>
      <DataProvider>
        {isLoggedIn ? (
          <Stack.Navigator initialRouteName={isParent ? "ParentMain" : "KidMain"}>
            {isParent && (
              <>
                <Stack.Screen 
                  name="ParentMain" 
                  component={ParentTabNavigator}
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="UserProfile" 
                  component={UserProfile}
                  options={{ headerShown: false }}
                />
              </>
            )}
            {!isParent && (
              <>
                <Stack.Screen 
                  name="KidMain" 
                  component={KidTabNavigator}
                  options={{ headerShown: false }} 
                />
                <Stack.Screen 
                  name="UserProfile" 
                  component={UserProfile}
                  options={{ headerShown: false }}
                />
              </>
            )}
          </Stack.Navigator>
        ) : (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
              name="Login" 
              component={Login}
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={Register}
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="newParent" 
              component={newParent}
              options={{ headerShown: false }} 
            />
          </Stack.Navigator>
        )}
      </DataProvider>
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWrapper;
