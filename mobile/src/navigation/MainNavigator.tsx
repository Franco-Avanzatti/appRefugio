import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../theme/colors";

import HomeScreen from "../screens/home/HomeScreen";
import ReservasScreen from "../screens/reservas/ReservasScreen";
import MisReservasScreen from "../screens/reservas/MisReservasScreen";
import PerfilScreen from "../screens/perfil/PerfilScreen";
import ConfirmacionScreen from "../screens/reservas/ConfirmacionScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,

        drawerStyle: {
          backgroundColor: colors.surface,
        },

        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.secondaryGray,

        drawerLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 14,
        },
      }}
    >
      <Drawer.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Mis Reservas"
        component={MisReservasScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigator}
      />

      <Stack.Screen
        name="Confirmacion"
        component={ConfirmacionScreen}
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}