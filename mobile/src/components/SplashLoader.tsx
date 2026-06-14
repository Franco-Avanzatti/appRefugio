import { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Image,
  StyleSheet,
} from "react-native";

import { colors } from "../theme/colors";

export default function SplashLoader() {
  const glowAnim = useRef(
    new Animated.Value(0.4)
  ).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoGlow,
          {
            opacity: glowAnim,
          },
        ]}
      />

      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  logoGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.06,
  },

  logo: {
    width: 180,
    height: 180,
  },
});