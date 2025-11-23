import React from 'react';
import { View, Text, Button } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>Bravos Grill & Smoke</Text>
      <Text style={{ fontSize: 18, textAlign: 'center', marginBottom: 24 }}>
        "Descubre lo mejor en Bravos con solo un clic."
      </Text>
      <Button title="Log In" onPress={() => navigation.navigate('Login')} />
      <Button title="Sign Up" onPress={() => navigation.navigate('Register')} />
      {/* Banner de descuento */}
      <View style={{ marginTop: 32, backgroundColor: '#e6c9a0', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#7a4f1d', fontWeight: 'bold' }}>15%+ Descuento en tu primera orden</Text>
      </View>
    </View>
  );
}
