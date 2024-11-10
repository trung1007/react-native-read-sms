// AppStateContext.tsx (or AppStateContext.jsx)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';


const AppStateContext = createContext<AppStateStatus | null>(null);

interface AppStateProviderProps {
  children: ReactNode;
}


export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [inApp, setInApp] = useState(true)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      setAppState(nextAppState);
      console.log("AppStateContext: " + nextAppState);
      if (nextAppState === 'background') {
        setInApp(false); // Set inApp to false when the app is in the background
      } else if (nextAppState === 'active') {
        setInApp(true); // Set inApp to true when the app is active
      }
    };

    // Add listener for AppState changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Clean up the listener when the component is unmounted
    return () => {
      subscription.remove();
    };

  }, []);

  // 4. Return the provider with the current app state value
  return (
    <AppStateContext.Provider value={inApp ? 'active' : 'background'}>
      {children}
    </AppStateContext.Provider>
  );
};


export const useAppStateContext = () => {
  const context = useContext(AppStateContext);
  if (context === null) {
    throw new Error("useAppStateContext must be used within an AppStateProvider");
  }
  return context;
};

