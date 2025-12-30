// SignupPage.js
import { useState } from 'react';
import {
  Alert, // Import Alert for user feedback
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
// Use useNavigation from @react-navigation/native if using React Navigation
// Or useRouter from 'expo-router' if using Expo Router
import { useNavigation } from '@react-navigation/native';

// Import auth, db, and necessary functions from your firebase config
import { useRouter } from 'expo-router';
import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from '../../config/firebase.config'; // Adjust path

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook
  const router = useRouter(); // Initialize router for Expo Router
  const handleSignup = async () => { // Renamed from nextPage for clarity
    try {
      console.log("Creating user:", email);
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up successfully:", response.user.email);

      // Create user document in Firestore
      await createUserFirestoreDocument(response.user, username); // Pass username

      Alert.alert('Success', 'Account created successfully!');
      // Navigate to your main app screen or login screen
      // If using React Navigation:
      // navigation.replace('Home'); // Replace 'Home' or 'Login'
      // If using Expo Router:
      router.replace('../(tabs)/news'); 
    } catch (error) {
      console.log("Signup Error:", error.message);
      Alert.alert('Signup Failed', error.message); // Provide user feedback
    }
  };

  const createUserFirestoreDocument = async (userData, username) => { // Added username parameter
    try {
      const userInfo = {
        email: userData.email,
        uid: userData.uid,
        username: username, // Save the username
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "Users", userData.uid), userInfo);
      console.log("Firestore document created for user:", userData.uid);
    } catch (error) {
      console.log("Firestore Error:", error.message);
      Alert.alert('Firestore Error', 'Could not save user data.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          placeholderTextColor="#555"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#555"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.hint}>Must be at least 6 characters.</Text>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    width: '100%',
    padding: 12,
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 5,
  },
  hint: {
    color: '#AAAAAA',
    fontSize: 12,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#000000',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  }
});

export default SignupPage;