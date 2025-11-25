import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Image } from "react-native";
import {
  Text,
  Card,
  TextInput,
  Button,
  IconButton,
  Portal,
  Modal,
} from "react-native-paper";

const reseñasDemo = [
  { id: 1, usuario: "Kiara Miranda", texto: "La mejor hamburguesa que he probado.", estrellas: 5 },
  { id: 2, usuario: "Camilo Micoló", texto: "Excelente atención y sabor.", estrellas: 4 },
  { id: 3, usuario: "Ignacio Chavez", texto: "Muy buena experiencia.", estrellas: 5 },
];

export default function ReviewsScreen() {
  const [reseñas, setReseñas] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [showAddMode, setShowAddMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const avatar = require("../assets/ChatGPT Image 5 sept 2025, 10_38_33 p.m..png");

  useEffect(() => {
    setReseñas(reseñasDemo);
  }, []);

  function submitReview() {
    const newReview = {
      id: Date.now(),
      usuario: name?.trim() ? name : "Anónimo",
      texto: comment || "",
      estrellas: stars,
      avatar: avatar,
    };
    setReseñas((s) => [newReview, ...s]);
    setName("");
    setComment("");
    setStars(5);
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        Reseñas
      </Text>

      <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
        <Button
          mode="contained"
          buttonColor="#7a4f1d"
          onPress={() => setShowModal(true)}
        >
          Añadir reseña
        </Button>
      </View>

      <FlatList
        data={reseñas}
        keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content style={styles.cardContentRow}>
              <Image
                source={item.avatar ? item.avatar : avatar}
                style={styles.itemAvatar}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.user}>{item.usuario}</Text>
                <Text style={styles.text}>{item.texto}</Text>
                <Text style={styles.stars}>{"★".repeat(item.estrellas)}</Text>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.addHeaderRow}>
            <IconButton
              icon="arrow-left"
              iconColor="#7a4f1d"
              onPress={() => setShowModal(false)}
            />
            <Text variant="headlineSmall" style={styles.addTitle}>
              Agregar reseña
            </Text>
          </View>
          <Card style={styles.formCard}>
            <Card.Content>
              <View style={styles.formRow}>
                <Image source={avatar} style={styles.avatarPreview} />
                <View style={{ flex: 1 }}>
                  <TextInput
                    label="Nombre"
                    value={name}
                    onChangeText={setName}
                    mode="outlined"
                    style={styles.input}
                  />
                  <TextInput
                    label="Comentario"
                    value={comment}
                    onChangeText={setComment}
                    mode="outlined"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                  />
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Button
                        key={n}
                        mode={stars === n ? "contained" : "outlined"}
                        buttonColor={stars === n ? "#7a4f1d" : undefined}
                        textColor={stars === n ? "#fff" : "#7a4f1d"}
                        onPress={() => setStars(n)}
                        style={styles.starBtn}
                      >
                        {n}★
                      </Button>
                    ))}
                  </View>
                  <View style={styles.modalButtonsRow}>
                    <Button
                      mode="outlined"
                      textColor="#7a4f1d"
                      onPress={() => setShowModal(false)}
                      style={styles.cancelBtn}
                    >
                      Cancelar
                    </Button>
                    <Button
                      mode="contained"
                      buttonColor="#7a4f1d"
                      onPress={() => {
                        submitReview();
                        setShowModal(false);
                      }}
                      style={styles.submitBtn}
                    >
                      Agregar reseña
                    </Button>
                  </View>
                </View>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontWeight: "700", marginBottom: 12 },
  formCard: { marginBottom: 12, borderRadius: 8, padding: 8 },
  formRow: { flexDirection: "row", alignItems: "flex-start" },
  avatarPreview: { width: 64, height: 64, borderRadius: 32, marginRight: 12 },
  input: { marginBottom: 8, backgroundColor: "#fff" },
  starsRow: { flexDirection: "row", marginBottom: 8, flexWrap: "wrap" },
  starBtn: { marginRight: 6, marginBottom: 6 },
  submitBtn: { marginTop: 6 },
  card: { marginBottom: 12, borderRadius: 8 },
  cardContentRow: { flexDirection: "row", alignItems: "center" },
  itemAvatar: { width: 56, height: 56, borderRadius: 28 },
  user: { fontWeight: "700", fontSize: 16, marginBottom: 6 },
  text: { marginBottom: 6 },
  stars: { color: "#e6c900" },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
    borderRadius: 24,
    paddingHorizontal: 14,
  },
  addHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  addTitle: { fontWeight: "700", fontSize: 18, marginLeft: 8 },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  cancelBtn: { marginRight: 8 },
});

