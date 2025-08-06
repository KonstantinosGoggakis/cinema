import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider, AuthContext } from "./context/AuthContext";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ReservationFormScreen from "./screens/ReservationFormScreen";
import EditReservationScreen from "./screens/EditReservationScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CinemasListScreen from "./screens/CinemasListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Navigator />
      </AuthProvider>
    </PaperProvider>
  );
}

const Navigator = () => {
  const { token } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
        {!token ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Cinemas" component={CinemasListScreen} />
            <Stack.Screen
              name="Reservation"
              component={ReservationFormScreen}
            />
            <Stack.Screen
              name="EditReservation"
              component={EditReservationScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
