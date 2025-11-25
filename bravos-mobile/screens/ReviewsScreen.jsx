import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Text, Button, Card, TextInput, Modal, Portal, Provider } from "react-native-paper";
import api from "../services/api";

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/resenas");
      setReviews(res.data || []);
    } catch (err) {
      Alert.alert("Error", "No se pudieron cargar las reseñas");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    if (!newReview.trim()) return;
    try {
      await api.post("/resenas", { texto: newReview });
      setNewReview("");
      setModalVisible(false);
      fetchReviews();
    } catch (err) {
      Alert.alert("Error", "No se pudo agregar la reseña");
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.addButton}>
          Agregar reseña
        </Button>
        <FlatList
          data={reviews}
          keyExtractor={item => item._id || item.id?.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text>{item.texto}</Text>
              </Card.Content>
            </Card>
          )}
          refreshing={loading}
          onRefresh={fetchReviews}
        />
        <Portal>
          <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modal}>
            <TextInput
              label="Tu reseña"
              value={newReview}
              onChangeText={setNewReview}
              style={{ marginBottom: 12 }}
            />
            <Button mode="contained" onPress={handleAddReview}>
              Enviar
            </Button>
          </Modal>
        </Portal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  addButton: { marginBottom: 16, borderRadius: 40 },
  card: { marginBottom: 12 },
  modal: { backgroundColor: "white", padding: 20, borderRadius: 8 },
});
