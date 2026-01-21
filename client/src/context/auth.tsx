// client/src/context/auth.tsx

import React, { useReducer, createContext, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Interface for the User payload (Token + User Info)
interface UserData {
  id: string;
  email: string;
  username: string;
  token: string;
  exp?: number; // Optional because it comes from the decoded token later
}

// 2. Interface for the State
interface AuthState {
  user: UserData | null;
}

// 3. Interface for the Context
interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

// 4. Initial State
const initialState: AuthState = {
  user: null
};

// Check for existing token on startup
if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode<UserData>(localStorage.getItem('jwtToken')!);

  // Check expiration (exp is in seconds)
  if (decodedToken.exp! * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
});

// 5. Defined Action Types for Reducer (No more 'any')
type AuthAction = 
  | { type: 'LOGIN'; payload: UserData }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
}

// 6. Typed Props for the Provider
interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData: UserData) {
    localStorage.setItem('jwtToken', userData.token);
    dispatch({
      type: 'LOGIN',
      payload: userData
    });
  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };