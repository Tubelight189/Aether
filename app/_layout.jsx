// app/_layout.jsx
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth'; // We will create this custom hook next
// This is your main layout for the entire app
const RootLayout = () => {
  const { user, initializing } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // If initialization is complete, proceed with routing logic
    if (!initializing) {
      const inAuthGroup = segments[0] === '(auth)';

      // If user is authenticated and is in the auth group, redirect to the main app
      if (user && inAuthGroup) {
        router.replace('/'); // Navigate to your main screen (index.jsx)
      } 
      // If user is not authenticated and is NOT in the auth group, redirect to the login screen
      else if (!user && !inAuthGroup) {
        router.replace('/login'); // Navigate to your login screen
      }
    }
  }, [user, segments, initializing]); // Rerun effect when user, segments, or initializing state changes

  // Show a loading indicator while Firebase is checking the auth state
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Render the actual navigation stack
  return (
       <ActionSheetProvider>
{/* <View style={{marginTop:35,backgroundColor:"black",color:"black",}}/> */}
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      {/* <Stack.Screen name="/camera" />
      <Stack.Screen name="/imagePicker" />
      <Stack.Screen name="/report" />
      <Stack.Screen name="/camera2" /> */}
      {/* Add other main app screens here if they should be part of the root stack */}
    </Stack>
      </ActionSheetProvider>
  );
};

export default RootLayout;