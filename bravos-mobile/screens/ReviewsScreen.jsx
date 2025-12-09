import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Alert, Image, TouchableOpacity } from "react-native";
import { Text, Button, Card, TextInput, Modal, Portal, Provider } from "react-native-paper";
import api from "../services/api";

// Avatar default para cada cliente
const AVATAR_DEFAULT = require("../assets/ChatGPT Image 5 sept 2025, 10_38_33 p.m..png");

export default function ReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0); // rating 0-5
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
    if (!newReview.trim() || rating === 0) {
      Alert.alert("Atención", "Por favor escribe tu reseña y selecciona un puntaje");
      return;
    }
    try {
      console.log("Enviando reseña:", { comentario: newReview, calificacion: rating });
      const response = await api.post("/resenas", { comentario: newReview, calificacion: rating });
      console.log("Respuesta del servidor:", response.data);
      setNewReview("");
      setRating(0);
      setModalVisible(false);
      fetchReviews();
      Alert.alert("Éxito", "Reseña agregada correctamente");
    } catch (err) {
      console.error("Error al agregar reseña:", err);
      console.error("Detalles del error:", err.response?.data || err.message);
      Alert.alert("Error", err.response?.data?.message || "No se pudo agregar la reseña");
    }
  };

  const renderStars = (rating) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text key={star} style={styles.star}>
            {star <= rating ? "★" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  const renderStarSelector = () => {
    return (
      <View style={styles.starSelector}>
        <Text style={styles.ratingLabel}>Tu calificación:</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={styles.starLarge}>
                {star <= rating ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Button
          mode="contained"
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          buttonColor="#7a4f1d"
          contentStyle={{ height: 46 }}
          icon="plus"
        >
          Agregar reseña
        </Button>
        <FlatList
          data={reviews}
          keyExtractor={item => item._id || item.id?.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Image source={AVATAR_DEFAULT} style={styles.avatar} />
                <View style={styles.reviewText}>
                  <Text style={styles.clientName}>{item.nombre || "Cliente"}</Text>
                  <Text style={styles.reviewContent}>{item.comentario}</Text>
                  {renderStars(item.calificacion || 0)}
                </View>
              </Card.Content>
            </Card>
          )}
          refreshing={loading}
          onRefresh={fetchReviews}
        />
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={() => {
              setModalVisible(false);
              setRating(0);
              setNewReview("");
            }}
            contentContainerStyle={styles.modal}
          >
            {renderStarSelector()}
            <TextInput
              label="Tu reseña"
              value={newReview}
              onChangeText={setNewReview}
              multiline
              numberOfLines={4}
              style={{ marginBottom: 16, marginTop: 12 }}
            />
            <Button mode="contained" onPress={handleAddReview} buttonColor="#7a4f1d">
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
  addButton: {
    marginBottom: 16,
    borderRadius: 40,
    elevation: 2,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  reviewText: {
    flex: 1,
  },
  clientName: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
    color: "#7a4f1d",
  },
  reviewContent: {
    marginBottom: 8,
    fontSize: 15,
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 18,
    color: "#FFD700",
    marginRight: 2,
  },
  starSelector: {
    marginBottom: 12,
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  starLarge: {
    fontSize: 36,
    color: "#FFD700",
    marginHorizontal: 4,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
  },
});
