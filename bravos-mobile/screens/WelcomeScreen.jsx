import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          Bravos Grill & Smoke
        </Text>
        
        <Text variant="titleLarge" style={styles.subtitle}>
          Descubre lo mejor en Bravos con solo un clic.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('Login')}
            style={styles.button}
          >
            Log In
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('Register')}
            style={styles.button}
          >
            Sign Up
          </Button>
        </View>
        
        <Card style={styles.promoCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.promoText}>
              15%+ Descuento en tu primera orden
            </Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
  promoCard: {
    marginTop: 32,
    backgroundColor: '#e6c9a0',
    width: '100%',
  },
  promoText: {
    color: '#7a4f1d',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});