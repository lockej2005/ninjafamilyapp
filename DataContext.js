import React, { createContext, useState, useContext } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [promises, setPromises] = useState([]);
    const [userScores, setUserScores] = useState({});
    const [rewards, setRewards] = useState([]);
    const [activeSection, setActiveSection] = useState('Outgoing');
    const [strikes, setStrikes] = useState({}); // Modified this line.
    const [outgoingPromises, setOutgoingPromises] = useState([]);
    const [keptPromises, setKeptPromises] = useState([]);
    const [brokenPromises, setBrokenPromises] = useState([]);
    const [userData, setUserData] = useState([]);   
    const [allPromises, setAllPromises] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [loggedUser, setLoggedUser] = useState([]);
    const [kidsUsernames, setKidsUsernames] = useState([]);

    return (
        <DataContext.Provider value={{ 
            loggedUser, setLoggedUser,
            promises, setPromises,
            userScores, setUserScores,
            rewards, setRewards,
            activeSection, setActiveSection,
            strikes, setStrikes,
            outgoingPromises, setOutgoingPromises,
            keptPromises, setKeptPromises,
            brokenPromises, setBrokenPromises,
            userData, setUserData,
            allPromises, setAllPromises,
            refreshData, setRefreshData,
            kidsUsernames, setKidsUsernames
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
