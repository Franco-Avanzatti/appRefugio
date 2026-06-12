import { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { useAuthStore } from "../../store/authStore";
import { DrawerActions } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuthStore();

  // Animaciones
  const fadeHeader = useRef(new Animated.Value(0)).current;
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const slideBottom = useRef(new Animated.Value(40)).current;
  const fadeBottom = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Secuencia de entrada
    Animated.sequence([
      Animated.timing(fadeHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeLogo, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeBottom, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideBottom, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start();

    // Glow pulsante en el logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.4, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>

      {/* Fondo con gradiente simulado */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: fadeHeader }]}>

        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(DrawerActions.openDrawer())
          }
        >
          <Ionicons
            name="menu"
            size={28}
            color={colors.white}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.welcome}>
            Hola, {user?.name?.split(" ")[0]} 👋
          </Text>
          <Text style={styles.subtitle}>
            ¿Reservamos una cancha hoy?
          </Text>
        </View>

        <View style={styles.rightSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() =>
              Alert.alert(
                "Cerrar sesión",
                "¿Deseás cerrar sesión?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                  },
                  {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: logout,
                  },
                ]
              )
            }
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

      </Animated.View>

      {/* Logo centro */}
      {/* Logo centro */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeLogo }]}>
        <Animated.View style={[styles.logoBadge, { opacity: glowAnim }]} />
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom */}
      <Animated.View style={[
        styles.bottom,
        { opacity: fadeBottom, transform: [{ translateY: slideBottom }] }
      ]}>

        {/* Horarios */}
        <View style={styles.horariosCard}>
          <Text style={styles.horariosTitle}>LUNES A LUNES</Text>
          <View style={styles.horariosRows}>
            <View style={styles.horarioRow}>
              <Ionicons name="time-outline" size={15} color={colors.primary} />
              <Text style={styles.horarioText}>08:00 a 13:00 hs</Text>
            </View>
            <View style={styles.horarioDot} />
            <View style={styles.horarioRow}>
              <Ionicons name="time-outline" size={15} color={colors.primary} />
              <Text style={styles.horarioText}>17:00 a 00:00 hs</Text>
            </View>
          </View>
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate("Reservas")}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.background} />
          <Text style={styles.btnPrimaryText}>RESERVAR CANCHA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate("Mis Reservas")}
          activeOpacity={0.8}
        >
          <Ionicons name="bookmark-outline" size={18} color={colors.white} />
          <Text style={styles.btnSecondaryText}>MIS RESERVAS</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  logoutButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: colors.darkGreen,
  borderWidth: 2,
  borderColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
},
  bgTop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },
  bgBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
    backgroundColor: "#0D1A0D",
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  welcome: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semiBold,
    color: colors.white,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.secondaryGray,
    marginTop: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.darkGreen,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.bold,
    color: colors.primary,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 300,
    height: 300,
  },
  logoBadge: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  horariosCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  horariosTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.semiBold,
    color: colors.secondaryGray,
    letterSpacing: 4,
    marginBottom: 10,
  },
  horariosRows: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  horarioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  horarioDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  horarioText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.white,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnPrimaryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.background,
    letterSpacing: 2,
  },
  btnSecondary: {
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 2,
  },
});