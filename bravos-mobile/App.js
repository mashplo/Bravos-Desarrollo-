<<<<<<< HEAD
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { Text, Image, View, StyleSheet } from "react-native";

// Set a different system font globally (quick dev change)
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = {
  fontFamily: "sans-serif-condensed",
  ...(Text.defaultProps.style || {}),
};
import WelcomeScreen from "./screens/WelcomeScreen";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreenNew";
import MenuScreen from "./screens/MenuScreen";
import OrderSummaryScreen from "./screens/OrderSummaryScreen";
import ReviewsScreen from "./screens/ReviewsScreen";

const LOGO = require("./assets/logo.png");

function HeaderBrand() {
  return (
    <View style={styles.headerBrand}>
      <Image source={LOGO} style={styles.headerLogo} />
      <Text style={styles.headerText}>Bravos</Text>
    </View>
  );
}
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import ReviewsScreen from './screens/ReviewsScreen';
>>>>>>> 11377c2af97db6237f4bdf17ef74d4d8d04faf9e

const Stack = createNativeStackNavigator();

export default function App() {
<<<<<<< HEAD
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#7a4f1d",
      secondary: "#7a4f1d",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
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
            options={{
              headerTitle: (props) => <HeaderBrand {...props} />,
              headerTitleAlign: "left",
            }}
          />
=======
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
>>>>>>> 11377c2af97db6237f4bdf17ef74d4d8d04faf9e
          <Stack.Screen name="OrderSummary" component={OrderSummaryScreen} />
          <Stack.Screen name="Reviews" component={ReviewsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
<<<<<<< HEAD
}

const styles = StyleSheet.create({
  headerBrand: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 36, height: 36, resizeMode: "contain", marginRight: 8 },
  headerText: { fontWeight: "800", fontSize: 18 },
});
=======
}
>>>>>>> 11377c2af97db6237f4bdf17ef74d4d8d04faf9e
