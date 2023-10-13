import { createContext } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  username: "",
  setUsername: () => {},
  isParent: true,
  setIsParent: () => {},
  // ... other values ...
});


export default AuthContext;
