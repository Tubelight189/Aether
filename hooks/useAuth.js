// hooks/useAuth.js
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../config/firebase.config'; // Adjust the path to your firebase config file

export function useAuth() {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // This listener is called whenever the user's sign-in state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // If user is logged in, this will be the user object, otherwise null
      if (initializing) {
        setInitializing(false); // Stop the loading state once we have the auth state
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return { user, initializing };
}