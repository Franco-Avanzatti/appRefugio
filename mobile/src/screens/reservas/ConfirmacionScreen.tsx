import { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { reservaService } from "../../services/reservaService";
import { Cancha } from "../../types";

dayjs.locale("es");

const DURACION = 90; // minutos

const calcularFin = (inicio: string): string => {
  const [h, m] = inicio.split(":").map(Number);
  const total = h * 60 + m + DURACION;
  const hFin = Math.floor(total / 60) % 24;
  const mFin = total % 60;
  return `${String(hFin).padStart(2, "0")}:${String(mFin).padStart(2, "0")}`;
};

export default function ConfirmacionScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { cancha, fecha, inicio }: { cancha: Cancha; fecha: string; inicio: string } = route.params;

  const [loading, setLoading] = useState(false);
  const [confirmada, setConfirmada] = useState(false);

  const fin = calcularFin(inicio);
  const fechaFormateada = dayjs(fecha).format("dddd D [de] MMMM");

  const handleConfirmar = async () => {
    try {
      setLoading(true);
      await reservaService.crearReserva(cancha._id, fecha, inicio);
      setConfirmada(true);
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Error al crear la reserva";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (confirmada) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>

          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={48} color={colors.background} />
          </View>

          <Text style={styles.successTitle}>¡Reserva confirmada!</Text>
          <Text style={styles.successSubtitle}>
            Tu reserva se ha realizado con éxito.
          </Text>

          {/* Detalle */}
          <View style={styles.detalleCard}>
            <View style={styles.detalleRow}>
              <Ionicons name="tennisball-outline" size={18} color={colors.secondaryGray} />
              <Text style={styles.detalleLabel}>Cancha</Text>
              <Text style={styles.detalleValor}>{cancha.nombre}</Text>
            </View>
            <View style={styles.detalleDivider} />
            <View style={styles.detalleRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.secondaryGray} />
              <Text style={styles.detalleLabel}>Día</Text>
              <Text style={styles.detalleValor}>{fechaFormateada}</Text>
            </View>
            <View style={styles.detalleDivider} />
            <View style={styles.detalleRow}>
              <Ionicons name="time-outline" size={18} color={colors.secondaryGray} />
              <Text style={styles.detalleLabel}>Horario</Text>
              <Text style={styles.detalleValor}>{inicio} a {fin} hs</Text>
            </View>
          </View>

          {/* Badge reservada por vos */}
          <View style={styles.badge}>
            <Ionicons name="person" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>RESERVADA POR VOS</Text>
          </View>

          {/* Botones */}
          <TouchableOpacity
            style={styles.btnWhatsapp}
            activeOpacity={0.8}
            onPress={() => Alert.alert("WhatsApp", "Compartir por WhatsApp próximamente")}
          >
            <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
            <Text style={styles.btnWhatsappText}>COMPARTIR POR WHATSAPP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSecondary}
            activeOpacity={0.8}
            onPress={() => navigation.navigate("Tabs", { screen: "Mis Reservas" })}
          >
            <Text style={styles.btnSecondaryText}>VER MIS RESERVAS</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  }

  // Pantalla de confirmación previa
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar reserva</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>

        {/* Detalle */}
        <View style={styles.detalleCard}>
          <View style={styles.detalleRow}>
            <Ionicons name="tennisball-outline" size={18} color={colors.secondaryGray} />
            <Text style={styles.detalleLabel}>Cancha</Text>
            <Text style={styles.detalleValor}>{cancha.nombre}</Text>
          </View>
          <View style={styles.detalleDivider} />
          <View style={styles.detalleRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.secondaryGray} />
            <Text style={styles.detalleLabel}>Día</Text>
            <Text style={styles.detalleValor}>{fechaFormateada}</Text>
          </View>
          <View style={styles.detalleDivider} />
          <View style={styles.detalleRow}>
            <Ionicons name="time-outline" size={18} color={colors.secondaryGray} />
            <Text style={styles.detalleLabel}>Horario</Text>
            <Text style={styles.detalleValor}>{inicio} a {fin} hs</Text>
          </View>
        </View>

        {/* Info duración */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.infoText}>
            La duración del turno es de 1 hora 30 minutos.
          </Text>
        </View>

        {/* Botón confirmar */}
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={handleConfirmar}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color={colors.background} />
            : <Text style={styles.btnPrimaryText}>CONFIRMAR RESERVA</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>CANCELAR</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  detalleCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detalleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  detalleLabel: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.secondaryGray,
    flex: 1,
  },
  detalleValor: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.semiBold,
    color: colors.white,
    textTransform: "capitalize",
  },
  detalleDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.secondaryGray,
    flex: 1,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
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
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 2,
  },
  // Success
  successContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: "center",
    gap: 16,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  successTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    textAlign: "center",
  },
  successSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.regular,
    color: colors.secondaryGray,
    textAlign: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.bold,
    color: colors.primary,
    letterSpacing: 2,
  },
  btnWhatsapp: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#25D366",
    borderRadius: 8,
    paddingVertical: 16,
    width: "100%",
    marginTop: 8,
  },
  btnWhatsappText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.bold,
    color: colors.white,
    letterSpacing: 2,
  },
});