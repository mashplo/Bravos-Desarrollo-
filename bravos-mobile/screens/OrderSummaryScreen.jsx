<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";

export default function OrderSummaryScreen({ navigation, route }) {
  const initial = (route && route.params && route.params.cart) || [];
  const [pedido, setPedido] = useState(initial.map((p) => ({ ...p })));

  useEffect(() => {
    setPedido(initial.map((p) => ({ ...p })));
  }, [route]);

  const changeQty = (id, delta) => {
    setPedido((prev) =>
      prev
        .map((it) =>
          it.id === id
            ? {
                ...it,
                qty: Math.max(0, (it.qty || it.cantidad || it.qty) + delta),
              }
            : it
        )
        .filter((it) => (it.qty || it.cantidad || it.qty) > 0)
    );
  };

  const itemsTotal = pedido.reduce(
    (s, it) => s + (it.price || 0) * (it.qty || it.cantidad || 0),
    0
  );
  const grandTotal = itemsTotal; // delivery removed as requested

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        {item.image ? (
          <Image source={item.image} style={styles.thumb} />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemSub}>
            Cantidad: {item.qty || item.cantidad || 1}
          </Text>
        </View>
      </View>

      <View style={styles.rowRight}>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => changeQty(item.id, -1)}
            style={styles.qtyBtn}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.qty || item.cantidad || 1}</Text>
          <TouchableOpacity
            onPress={() => changeQty(item.id, 1)}
            style={styles.qtyBtn}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>
          S/{((item.price || 0) * (item.qty || item.cantidad || 1)).toFixed(2)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.headerTitle}>
        My order
      </Text>

      <FlatList
        data={pedido}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 240 }}
      />

      <View style={styles.summaryBox}>
        <View style={[styles.summaryRow, { borderTopWidth: 0 }]}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>S/{grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.orderWrap}>
        <Button
          mode="contained"
          buttonColor="#e6c9a0"
          contentStyle={{ height: 50 }}
          style={styles.orderButton}
          onPress={() => {
            setShowModal(true);
          }}
        >
          Ordenar
        </Button>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Finalizar Compra</Text>

            <View style={styles.stepsRow}>
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <Text style={styles.stepLabel}>Seleccionar Productos</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <Text style={styles.stepLabel}>Calcular Subtotal</Text>
              </View>
              <View style={styles.stepItem}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <Text style={styles.stepLabel}>Realizar Pago</Text>
              </View>
            </View>

            <View style={styles.modalSummary}>
              <Text style={{ color: "#8b6b53" }}>Resumen de compra</Text>
              <Text style={{ marginTop: 6 }}>{pedido.length} producto(s)</Text>
              <Text
                style={{
                  position: "absolute",
                  right: 12,
                  top: 12,
                  fontWeight: "700",
                }}
              >
                S/{grandTotal.toFixed(2)}
              </Text>
            </View>

            <View style={styles.payGrid}>
              <TouchableOpacity
                style={[
                  styles.payCard,
                  selectedPayment === "card" && styles.payCardSelected,
                ]}
                onPress={() => setSelectedPayment("card")}
              >
                <Text>Tarjeta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payCard,
                  selectedPayment === "cash" && styles.payCardSelected,
                ]}
                onPress={() => setSelectedPayment("cash")}
              >
                <Text>Efectivo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payCard,
                  selectedPayment === "transfer" && styles.payCardSelected,
                ]}
                onPress={() => setSelectedPayment("transfer")}
              >
                <Text>Transferencia</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payCard,
                  selectedPayment === "wallet" && styles.payCardSelected,
                ]}
                onPress={() => setSelectedPayment("wallet")}
              >
                <Text>Wallet Digital</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{ color: "#8b6b53" }}>Cancelar</Text>
              </TouchableOpacity>
              <Button
                mode="contained"
                buttonColor="#000"
                onPress={() => {
                  // close modal and navigate back to Menu with success flag
                  setShowModal(false);
                  navigation.navigate("Menu", { orderSuccess: true });
                }}
                contentStyle={{ height: 44 }}
                style={{ borderRadius: 20 }}
              >
                Pagar S/{grandTotal.toFixed(2)}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerTitle: { fontWeight: "700", fontSize: 20, padding: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowLeft: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 44, height: 44, borderRadius: 22 },
  thumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#eee",
  },
  itemName: { fontWeight: "700" },
  itemSub: { color: "#666", fontSize: 12 },
  rowRight: { alignItems: "flex-end" },
  qtyRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f2e8df",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { marginHorizontal: 8, minWidth: 20, textAlign: "center" },
  itemPrice: { fontWeight: "700" },
  sep: { height: 12 },
  summaryBox: {
    backgroundColor: "#e6e1dc",
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 12,
    marginBottom: 110,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: { color: "#333" },
  summaryValue: { fontWeight: "700" },
  orderWrap: { position: "absolute", left: 16, right: 16, bottom: 20 },
  orderButton: { borderRadius: 24 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
  },
  modalTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 12,
    color: "#7a3f1b",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#7a3f1b",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepNumber: { color: "#fff", fontWeight: "700" },
  stepLabel: { fontSize: 10, color: "#8b6b53", textAlign: "center" },
  modalSummary: {
    backgroundColor: "#fff2e6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  payGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  payCard: {
    width: "48%",
    backgroundColor: "#fff4ea",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payCardSelected: { backgroundColor: "#7a4f1b", color: "#fff" },
});
=======
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const pedidoDemo = [
  { id: 0, name: 'Smash Burguer', cantidad: 2, price: 5.99 },
  { id: 6, name: 'Coca cola', cantidad: 1, price: 1.99 },
];

export default function OrderSummaryScreen({ navigation }) {
  const [pedido, setPedido] = useState([]);

  useEffect(() => {
    // Aquí podrías hacer fetch a la API, por ahora demo
    setPedido(pedidoDemo);
  }, []);

  const total = pedido.reduce((sum, item) => sum + item.price * item.cantidad, 0);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>My order</Text>
      <FlatList
        data={pedido}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8 }}>
            <Text style={{ flex: 1, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ width: 60 }}>x{item.cantidad}</Text>
            <Text style={{ width: 80 }}>S/{(item.price * item.cantidad).toFixed(2)}</Text>
          </View>
        )}
      />
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Total: S/{total.toFixed(2)}</Text>
      <Button title="Ordenar" onPress={() => {}} />
    </View>
  );
}
>>>>>>> 11377c2af97db6237f4bdf17ef74d4d8d04faf9e
