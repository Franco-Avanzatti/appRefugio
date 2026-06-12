import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";

import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

interface Props {
  title: string;
}

export default function AppHeader({ title }: Props) {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
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

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },

  content: {
    marginLeft: 16,
  },

  title: {
    color: colors.white,
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.semiBold,
  },
});