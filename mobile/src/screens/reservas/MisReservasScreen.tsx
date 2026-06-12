import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";
import "dayjs/locale/es";
import AppHeader from "../../components/AppHeader";
import { reservaService } from "../../services/reservaService";
import { Reserva } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";

dayjs.locale("es");

const DURACION = 90;

const calcularFin = (inicio: string) => {
  const [h, m] = inicio.split(":").map(Number);

  const total = h * 60 + m + DURACION;

  const hFin = Math.floor(total / 60) % 24;
  const mFin = total % 60;

  return `${String(hFin).padStart(2, "0")}:${String(mFin).padStart(2, "0")}`;
};

export default function MisReservasScreen() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarReservas = async () => {
    try {
      setLoading(true);

      const data = await reservaService.getMisReservas();

      console.log(
        "MIS RESERVAS =>",
        JSON.stringify(data, null, 2)
      );

      setReservas(data);
    } catch (error) {
      console.log("ERROR MIS RESERVAS:", error);

      Alert.alert(
        "Error",
        "No se pudieron cargar tus reservas"
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarReservas();
    }, [])
  );

  const cancelarReserva = (id: string) => {
    Alert.alert(
      "Cancelar reserva",
      "¿Estás seguro que querés cancelar esta reserva?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await reservaService.cancelarReserva(id);

              setReservas((prev) =>
                prev.filter((r) => r._id !== id)
              );

              Alert.alert(
                "Reserva cancelada",
                "La reserva fue cancelada correctamente."
              );
            } catch {
              Alert.alert(
                "Error",
                "No se pudo cancelar la reserva."
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Mis Reservas" />

      <View style={styles.content}>
        {reservas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="calendar-outline"
              size={60}
              color={colors.secondaryGray}
            />

            <Text style={styles.emptyTitle}>
              No tenés reservas
            </Text>

            <Text style={styles.emptyText}>
              Cuando reserves una cancha aparecerá acá.
            </Text>
          </View>
        ) : (
          reservas.map((reserva) => {
            const cancha = reserva.cancha;

            return (
              <View
                key={reserva._id}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.canchaInfo}>
                    <Ionicons
                      name={
                        cancha?.techada
                          ? "home-outline"
                          : "sunny-outline"
                      }
                      size={22}
                      color={colors.primary}
                    />

                    <View>
                      <Text style={styles.canchaNombre}>
                        {cancha?.nombre ?? "Sin nombre"}
                      </Text>

                      <Text style={styles.canchaTipo}>
                        {cancha?.techada
                          ? "Techada"
                          : "Aire libre"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.row}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={colors.secondaryGray}
                  />

                  <Text style={styles.label}>
                    {dayjs(reserva.fecha).format(
                      "dddd D [de] MMMM"
                    )}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Ionicons
                    name="time-outline"
                    size={18}
                    color={colors.secondaryGray}
                  />

                  <Text style={styles.label}>
                    {reserva.inicio} -{" "}
                    {calcularFin(reserva.inicio)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={() =>
                    cancelarReserva(reserva._id)
                  }
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={18}
                    color={colors.white}
                  />

                  <Text style={styles.btnCancelarText}>
                    Cancelar reserva
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },

  loader: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    marginTop: 60,
    marginBottom: 24,
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.bold,
    color: colors.white,
  },

  emptyText: {
    marginTop: 8,
    color: colors.secondaryGray,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardHeader: {
    marginBottom: 10,
  },

  canchaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  canchaNombre: {
    color: colors.white,
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
  },

  canchaTipo: {
    color: colors.secondaryGray,
    fontSize: typography.sizes.sm,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },

  label: {
    color: colors.white,
    fontSize: typography.sizes.sm,
  },

  btnCancelar: {
    marginTop: 10,
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  btnCancelarText: {
    color: colors.white,
    fontFamily: typography.fonts.semiBold,
  },
});