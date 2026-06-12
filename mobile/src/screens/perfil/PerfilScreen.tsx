import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useAuthStore } from "../../store/authStore";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import AppHeader from "../../components/AppHeader";

export default function PerfilScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View style={styles.container}>
      <AppHeader title="Mi Perfil" />
      <View style={styles.content}>
        <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.btnLogout} onPress={logout}>
        <Text style={styles.btnLogoutText}>CERRAR SESIÓN</Text>
      </TouchableOpacity>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 32,
    alignItems: "center",
    gap: 12,
  },
  content: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  email: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.secondaryGray,
  },
  btnLogout: {
    marginTop: 32,
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  btnLogoutText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 2,
  },
});