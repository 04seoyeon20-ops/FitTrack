import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface StoredUser extends User {
  pin: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  userExists: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  signup: (details: { name: string; age: number; weight: number; height: number; pin: string }) => Promise<void>;
  updateUser: (newDetails: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [userExists, setUserExists] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const userDataString = localStorage.getItem('fitTrackUser');
      if (userDataString) {
        setUserExists(true);
        const storedUser: StoredUser = JSON.parse(userDataString);
        const { pin, ...userData } = storedUser;
        setUser(userData);

        const token = localStorage.getItem('authToken');
        if (token === 'true') {
          setIsAuthenticated(true);
        }
      } else {
        setUserExists(false);
      }
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        // Clear potentially corrupted data
        localStorage.removeItem('fitTrackUser');
        localStorage.removeItem('authToken');
        setUserExists(false);
    } finally {
        setIsLoading(false);
    }
  }, []);

  const login = async (pin: string): Promise<boolean> => {
    const userDataString = localStorage.getItem('fitTrackUser');
    if (userDataString) {
      const storedUser: StoredUser = JSON.parse(userDataString);
      if (storedUser.pin === pin) {
        localStorage.setItem('authToken', 'true');
        setIsAuthenticated(true);
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  const signup = async (details: { name: string; age: number; weight: number; height: number; pin: string }) => {
    const today = new Date().toLocaleDateString('en-CA', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/-/g, '-').split(', ')[0].slice(3); // "10-27" like format
    const newUser: StoredUser = {
      name: details.name,
      age: details.age,
      weight: details.weight,
      height: details.height,
      pin: details.pin,
      avatarUrl: `https://avatar.vercel.sh/${details.name}.svg?text=${details.name.substring(0,2)}`,
      workoutStreak: 0,
      muscleMass: 0,
      weightHistory: [{ date: today, weight: details.weight }],
      muscleMassHistory: [],
      recentWorkouts: { today: [], yesterday: [] },
    };
    
    localStorage.setItem('fitTrackUser', JSON.stringify(newUser));
    localStorage.setItem('authToken', 'true');

    const { pin, ...userData } = newUser;
    setUser(userData);
    setIsAuthenticated(true);
    setUserExists(true);
  };
  
  const updateUser = async (newDetails: User) => {
    const userDataString = localStorage.getItem('fitTrackUser');
    if (userDataString) {
        const storedUser: StoredUser = JSON.parse(userDataString);
        const updatedStoredUser: StoredUser = { ...storedUser, ...newDetails };
        
        localStorage.setItem('fitTrackUser', JSON.stringify(updatedStoredUser));
        setUser(newDetails);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, userExists, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};