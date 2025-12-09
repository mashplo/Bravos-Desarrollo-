import React, { useState } from "react";
import { View, StyleSheet, Modal, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Text, Button, Portal, IconButton } from "react-native-paper";
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';

const API_URL = "https://bravos-backend-production.up.railway.app";

export default function RdfButton() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const [format, setFormat] = useState("turtle");

  const fetchRdf = async (fmt) => {
    setFormat(fmt);
    try {
      const res = await fetch(`${API_URL}/api/rdf?format=${fmt}`);
      const txt = await res.text();
      setContent(txt);
    } catch (e) {
      setContent("Error cargando RDF");
      Alert.alert("Error", "No se pudo cargar el RDF");
    }
  };

  const handleOpen = async () => {
    await fetchRdf("turtle");
    setVisible(true);
  };

  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(content);
      Alert.alert("Éxito", "RDF copiado al portapapeles");
    } catch (e) {
      Alert.alert("Error", "No se pudo copiar");
    }
  };

  const handleOpenBrowser = () => {
    const url = `${API_URL}/api/rdf?format=${format}`;
    Linking.openURL(url);
  };

  const handleOpenGraph = () => {
    const url = `${API_URL}/api/grafo`;
    Linking.openURL(url);
  };

  return (
    <>
      <IconButton
        icon="file-document"
        size={24}
        onPress={handleOpen}
        iconColor="#7a4f1d"
      />

      <Portal>
        <Modal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          animationType="slide"
          transparent={false}
        >
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text variant="headlineSmall" style={styles.title}>
                RDF del sitio
              </Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setVisible(false)}
              />
            </View>

            <View style={styles.formatButtons}>
              <Button
                mode={format === "turtle" ? "contained" : "outlined"}
                onPress={() => fetchRdf("turtle")}
                buttonColor={format === "turtle" ? "#7a4f1d" : undefined}
                style={styles.formatButton}
              >
                Turtle (.ttl)
              </Button>
              <Button
                mode={format === "xml" ? "contained" : "outlined"}
                onPress={() => fetchRdf("xml")}
                buttonColor={format === "xml" ? "#7a4f1d" : undefined}
                style={styles.formatButton}
              >
                RDF/XML (.rdf)
              </Button>
            </View>

            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                onPress={handleOpenBrowser}
                icon="open-in-new"
                style={styles.actionButton}
              >
                Abrir
              </Button>
              <Button
                mode="outlined"
                onPress={handleCopy}
                icon="content-copy"
                style={styles.actionButton}
              >
                Copiar
              </Button>
              <Button
                mode="outlined"
                onPress={handleOpenGraph}
                icon="graph"
                style={styles.actionButton}
              >
                Ver Grafo
              </Button>
            </View>

            <ScrollView style={styles.contentContainer}>
              <View style={styles.codeBlock}>
                <Text style={styles.codeText}>{content}</Text>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={() => setVisible(false)}
                buttonColor="#7a4f1d"
                style={styles.closeButton}
              >
                Cerrar
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontWeight: "700",
  },
  formatButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  formatButton: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  codeBlock: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#333",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  closeButton: {
    borderRadius: 8,
  },
});
