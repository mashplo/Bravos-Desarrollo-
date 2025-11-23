import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';
import { saveToken } from '../store/user';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });
      if (res.data.token) {
        await saveToken(res.data.token);
        Alert.alert('Bienvenido', 'Login exitoso');
        navigation.navigate('Menu');
      } else {
        Alert.alert('Error', res.data.message || 'No se pudo iniciar sesión');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>Iniciar Sesión</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 12, borderBottomWidth: 1 }} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 24, borderBottomWidth: 1 }} />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
