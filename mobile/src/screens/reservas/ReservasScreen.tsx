// ReservasScreen.tsx

import { useState, useEffect, useCallback } from "react";
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
import dayjs from "dayjs";
import "dayjs/locale/es";
import AppHeader from "../../components/AppHeader";

import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { canchaService } from "../../services/canchaService";
import { reservaService } from "../../services/reservaService";
import { Cancha, Reserva } from "../../types";
import { HORARIOS_RESERVA } from "../../constants";
import { useNavigation } from "@react-navigation/native";

dayjs.locale("es");

const DIAS_A_MOSTRAR = 7;

export default function ReservasScreen() {
  const navigation = useNavigation<any>();

  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    dayjs().format("YYYY-MM-DD")
  );

  const [horarioSeleccionado, setHorarioSeleccionado] =
    useState<string | null>(null);

  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);

  const dias = Array.from(
    { length: DIAS_A_MOSTRAR },
    (_, i) => dayjs().add(i, "day")
  );

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const [canchasData, reservasData] = await Promise.all([
        canchaService.getCanchas(),
        reservaService.getReservasByFecha(fechaSeleccionada),
      ]);

      setCanchas(canchasData);
      setReservas(reservasData);
    } catch {
      Alert.alert("Error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [fechaSeleccionada]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const canchasDisponibles = horarioSeleccionado
    ? canchas.filter((cancha) => {
      return !reservas.some((r) => {
        const canchaId =
          r.cancha && typeof r.cancha === "object"
            ? r.cancha._id
            : r.cancha;

        if (!canchaId) return false;

        return (
          canchaId === cancha._id &&
          r.inicio === horarioSeleccionado &&
          r.estado === "confirmada"
        );
      });
    })
    : [];

  const reservar = (cancha: Cancha) => {
    navigation.navigate("Confirmacion", {
      cancha,
      fecha: fechaSeleccionada,
      inicio: horarioSeleccionado,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <AppHeader title="Reservar cancha" />

      <View style={styles.content}>
        {/* Fechas */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.fechasContainer}
        >
          {dias.map((dia) => {
            const fecha = dia.format("YYYY-MM-DD");
            const activo = fecha === fechaSeleccionada;

            return (
              <TouchableOpacity
                key={fecha}
                style={[
                  styles.fechaCard,
                  activo && styles.fechaCardActiva,
                ]}
                onPress={() => {
                  setFechaSeleccionada(fecha);
                  setHorarioSeleccionado(null);
                }}
              >
                <Text style={styles.fechaDia}>
                  {dia.format("ddd").toUpperCase()}
                </Text>

                <Text style={styles.fechaNumero}>
                  {dia.format("D")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Horarios */}

        <Text style={styles.sectionTitle}>
          Seleccioná un horario
        </Text>

        <View style={styles.horariosContainer}>
          {HORARIOS_RESERVA.map((hora) => {
            const activo = hora === horarioSeleccionado;

            return (
              <TouchableOpacity
                key={hora}
                style={[
                  styles.horarioBtn,
                  activo && styles.horarioBtnActivo,
                ]}
                onPress={() => setHorarioSeleccionado(hora)}
              >
                <Text
                  style={[
                    styles.horarioText,
                    activo && styles.horarioTextActivo,
                  ]}
                >
                  {hora}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Canchas */}

        {horarioSeleccionado && (
          <>
            <Text style={styles.sectionTitle}>
              Canchas disponibles
            </Text>

            {canchasDisponibles.map((cancha) => (
              <TouchableOpacity
                key={cancha._id}
                style={styles.canchaCard}
                onPress={() => reservar(cancha)}
              >
                <View style={styles.canchaInfo}>
                  <Ionicons
                    name={
                      cancha.techada
                        ? "home-outline"
                        : "sunny-outline"
                    }
                    size={22}
                    color={colors.primary}
                  />

                  <View>
                    <Text style={styles.canchaNombre}>
                      {cancha.nombre}
                    </Text>

                    <Text style={styles.canchaTipo}>
                      {cancha.techada
                        ? "Techada"
                        : "Aire libre"}
                    </Text>
                  </View>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.secondaryGray}
                />
              </TouchableOpacity>
            ))}

            {canchasDisponibles.length === 0 && (
              <Text style={styles.sinDisponibilidad}>
                No hay canchas disponibles para ese horario.
              </Text>
            )}
          </>
        )}
      </View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
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
    color: colors.white,
    fontSize: typography.sizes.xl,
    fontFamily: typography.fonts.bold,
  },

  fechasContainer: {
    gap: 10,
    paddingBottom: 10,
  },

  fechaCard: {
    width: 60,
    height: 70,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  fechaCardActiva: {
    backgroundColor: colors.primary,
  },

  fechaDia: {
    color: colors.white,
    fontFamily: typography.fonts.medium,
  },

  fechaNumero: {
    color: colors.white,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes.md,
  },

  sectionTitle: {
    color: colors.white,
    marginTop: 24,
    marginBottom: 12,
    fontFamily: typography.fonts.semiBold,
    fontSize: typography.sizes.md,
  },

  horariosContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  horarioBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },

  horarioBtnActivo: {
    backgroundColor: colors.primary,
  },

  horarioText: {
    color: colors.white,
    fontFamily: typography.fonts.medium,
  },

  horarioTextActivo: {
    color: colors.background,
  },

  canchaCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  canchaInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  canchaNombre: {
    color: colors.white,
    fontFamily: typography.fonts.semiBold,
  },

  canchaTipo: {
    color: colors.secondaryGray,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
  },

  sinDisponibilidad: {
    color: colors.secondaryGray,
    textAlign: "center",
    marginTop: 20,
  },
});