import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { Text, Image, View, StyleSheet, Alert } from "react-native";
import { setOnSessionExpired } from "./services/api";

import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreenNew";
import MenuScreen from "./screens/MenuScreen";
import OrderSummaryScreen from "./screens/OrderSummaryScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import HistorialScreen from "./screens/HistorialScreen";
import ProfileScreen from "./screens/ProfileScreen";

const LOGO = require("./assets/logo.png");

function HeaderBrand() {
  return (
    <View style={styles.headerBrand}>
      <Image source={LOGO} style={styles.headerLogo} />
      <Text style={styles.headerText}>Bravos</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#7a4f1d",
    secondary: "#7a4f1d",
  },
};

export default function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    // Configurar callback para cuando la sesión expire
    setOnSessionExpired(() => {
      Alert.alert(
        "Sesión cerrada",
        "Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo.",
        [
          {
            text: "OK",
            onPress: () => {
              if (navigationRef.current) {
                navigationRef.current.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                });
              }
            },
          },
        ]
      );
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen 
            name="Menu" 
            component={MenuScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
          <Stack.Screen
            name="Historial"
            component={HistorialScreen}
            options={{ title: "Mi Historial" }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ title: "Mi Perfil", headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  headerBrand: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 36, height: 36, resizeMode: "contain", marginRight: 8 },
  headerText: { fontWeight: "800", fontSize: 18 },
});
