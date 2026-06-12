import { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import * as Linking from "expo-linking";
import { useAuthStore } from "../../store/authStore";
import { authService } from "../../services/authService";
import { API_URL } from "../../constants";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { setAuth } = useAuthStore();

  const handleGoogleLogin = async () => {
    console.log("🟢 Abriendo browser:", `${API_URL}/auth/google`);
    try {
      await Linking.openURL(`${API_URL}/auth/google`);
    } catch (e) {
      console.log("🔴 Error:", e);
      Alert.alert("Error", "No se pudo abrir el navegador");
    }
  };

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const { queryParams } = Linking.parse(url);
      const accessToken = queryParams?.accessToken as string;
      const refreshToken = queryParams?.refreshToken as string;

      if (!accessToken) return;

      try {
        await SecureStore.setItemAsync("accessToken", accessToken);
        if (refreshToken) {
          await SecureStore.setItemAsync("refreshToken", refreshToken);
        }
        const user = await authService.getMe();
        await setAuth(user, accessToken);
      } catch (error) {
        Alert.alert("Error", "No se pudo iniciar sesión");
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    Linking.getInitialURL().then((url) => {
      if (url) handleUrl(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ImageBackground
      source={require("../../../assets/cancha.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>

        <View style={styles.bottom}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleGoogleLogin}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={20} color={colors.background} />
              <Text style={styles.btnPrimaryText}>CONTINUAR CON GOOGLE</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "flex-end",
    paddingBottom: 30,
  },
  bottom: {
    gap: 24,
  },
  logoContainer: {
    alignItems: "center",
    gap: 4,
  },
  logoTitle: {
    fontSize: typography.sizes.xxl,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 6,
    marginTop: 16,
  },
  logoSubtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.primary,
    letterSpacing: 8,
  },
  horariosContainer: {
    alignItems: "center",
    gap: 8,
  },
  horariosTitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.secondaryGray,
    letterSpacing: 4,
    marginBottom: 8,
  },
  horarioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  horarioText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.medium,
    color: colors.white,
  },
  buttonsContainer: {
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnPrimaryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.background,
    letterSpacing: 2,
  },
});