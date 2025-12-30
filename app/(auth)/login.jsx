// LoginPage.js
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

// Import auth and signInWithEmailAndPassword from your firebase config
import { useRouter } from 'expo-router';
import { auth, signInWithEmailAndPassword } from '../../config/firebase.config'; // Adjust path as needed

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook
  const router = useRouter(); // Initialize router for Expo Router
  const Signin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User Signed in: ", userCredential.user.email);
    Alert.alert('Success', 'Logged in successfully!');
    router.replace('../(tabs)/news'); 
  } catch (error) {
    console.error("Login Error:", error);
    Alert.alert('Login Failed', String(error.message || error.code || "Unknown error"));
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>

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
          placeholder="Enter your password"
          placeholderTextColor="#555"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text style={styles.hint}>Must be at least 6 characters.</Text>

        <TouchableOpacity style={styles.button} onPress={Signin}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/signup')}>
  <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
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

export default LoginPage;