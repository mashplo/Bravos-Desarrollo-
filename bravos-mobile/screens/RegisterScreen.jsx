import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await api.post('/auth/register', {
        nombre,
        email,
        password,
      });
      if (res.data.success) {
        Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', res.data.message || 'No se pudo registrar');
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo registrar');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>Registro</Text>
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={{ marginBottom: 12, borderBottomWidth: 1 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 12, borderBottomWidth: 1 }} />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 24, borderBottomWidth: 1 }} />
      <Button title="Registrarse" onPress={handleRegister} />
      <Button title="Ya tengo cuenta" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
