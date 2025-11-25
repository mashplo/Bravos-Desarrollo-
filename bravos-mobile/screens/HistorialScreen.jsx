import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Image, RefreshControl } from "react-native";
import { Text, Card, ActivityIndicator, Button, Chip } from "react-native-paper";
import api from "../services/api";

export default function HistorialScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pedidos/historial");
      if (response.data.success) {
        setPedidos(response.data.pedidos);
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    cargarHistorial();
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case "en_preparacion":
        return { color: "#f59e0b", label: "En preparación" };
      case "enviado":
        return { color: "#3b82f6", label: "Enviado" };
      case "entregado":
        return { color: "#10b981", label: "Entregado" };
      default:
        return { color: "#6b7280", label: estado };
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7a4f1d" />
        <Text style={{ marginTop: 12 }}>Cargando historial...</Text>
      </View>
    );
  }

  if (pedidos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text variant="headlineMedium" style={styles.emptyText}>
          No tienes pedidos aún
        </Text>
        <Button
          mode="contained"
          buttonColor="#7a4f1d"
          onPress={() => navigation.navigate("Menu")}
          style={{ marginTop: 20 }}
        >
          Ver Menú
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7a4f1d"]} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.title}>
          Mi Historial
        </Text>
      </View>

      {pedidos.map((pedido) => {
        const estadoConfig = getEstadoConfig(pedido.estado);
        return (
          <Card key={pedido.id} style={styles.pedidoCard}>
            <Card.Content>
              {/* Header del pedido */}
              <View style={styles.pedidoHeader}>
                <View>
                  <Text variant="titleLarge" style={styles.pedidoId}>
                    Pedido #{pedido.id}
                  </Text>
                  <Text variant="bodySmall" style={styles.pedidoFecha}>
                    {new Date(pedido.fecha).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <Chip
                  style={{ backgroundColor: estadoConfig.color }}
                  textStyle={{ color: "#fff", fontWeight: "bold" }}
                >
                  {estadoConfig.label}
                </Chip>
              </View>

              {/* Items del pedido */}
              <View style={styles.itemsContainer}>
                {pedido.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text variant="titleMedium" style={styles.itemName}>
                        {item.name}
                      </Text>
                      <Text variant="bodySmall" style={styles.itemCantidad}>
                        Cantidad: {item.cantidad}
                      </Text>
                    </View>
                    <Text variant="titleMedium" style={styles.itemPrecio}>
                      S/{(item.price * item.cantidad).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Footer del pedido */}
              <View style={styles.divider} />
              <View style={styles.pedidoFooter}>
                <Text variant="bodyMedium" style={styles.metodoPago}>
                  Pago: {pedido.metodo_pago}
                </Text>
                <Text variant="headlineSmall" style={styles.total}>
                  Total: S/{pedido.total.toFixed(2)}
                </Text>
              </View>
            </Card.Content>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontWeight: "bold",
    color: "#7a4f1d",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
  pedidoCard: {
    margin: 12,
    borderRadius: 12,
    elevation: 3,
  },
  pedidoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  pedidoId: {
    fontWeight: "bold",
    color: "#7a4f1d",
  },
  pedidoFecha: {
    color: "#666",
    marginTop: 4,
  },
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontWeight: "600",
  },
  itemCantidad: {
    color: "#666",
    marginTop: 2,
  },
  itemPrecio: {
    fontWeight: "bold",
    color: "#7a4f1d",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  pedidoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metodoPago: {
    color: "#666",
  },
  total: {
    fontWeight: "bold",
    color: "#7a4f1d",
  },
});
