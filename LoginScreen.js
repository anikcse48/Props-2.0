import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Secure store for saving user email
import { loginUser } from './database';

export default function LoginScreen({ navigation, loginHandler }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    const result = await loginUser(email, password);
    if (result.success) {
      loginHandler();
    } else {
      Alert.alert('Login Failed', result.message);
    }
  } catch (error) {
    Alert.alert('Error', 'Login failed. Please try again.');
  }
};
  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
        Don't have an account? Register here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 6 },
  link: { marginTop: 16, color: 'blue', textAlign: 'center' },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});