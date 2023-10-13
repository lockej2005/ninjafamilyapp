import React, { createContext, useState, useContext } from 'react';

const AppResetContext = createContext();

const AppResetProvider = ({ children }) => {
  const [resetKey, setResetKey] = useState(Date.now());

  const resetApp = () => {
    setResetKey(Date.now());
  };

  return (
    <AppResetContext.Provider value={resetApp}>
      <React.Fragment key={resetKey}>
        {children}
      </React.Fragment>
    </AppResetContext.Provider>
  );
};

const useAppReset = () => {
  const context = useContext(AppResetContext);
  if (!context) {
    throw new Error("useAppReset must be used within an AppResetProvider");
  }
  return context;
};

export { AppResetProvider, useAppReset };
