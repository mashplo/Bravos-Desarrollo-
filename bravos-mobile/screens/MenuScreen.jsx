import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	Image,
	ImageBackground,
	TouchableOpacity,
	SafeAreaView,
	Dimensions,
	Platform,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";

const HEADER_IMAGE = require("../assets/Hamburguesa-Texana-1200x709.avif");

const productosDemo = [
  // Hamburguesas
  {
    id: 1,
    name: "Smash Burger",
    price: 25.0,
    image: require("../assets/imagen_convertida.jpg"),
    category: "hamburguesas",
  },
  {
    id: 2,
    name: "Classic Burger",
    price: 27.0,
    image: require("../assets/ChatGPT Image 6 sept 2025, 08_37_03 p.m..png"),
    category: "hamburguesas",
  },
  {
    id: 3,
    name: "Texana Especial",
    price: 30.0,
    image: require("../assets/istockphoto-520410807-612x612.jpg"),
    category: "hamburguesas",
  },
  {
    id: 4,
    name: "Bravos Signature",
    price: 32.0,
    image: require("../assets/N5EPKUWMIVH4RCPNDM7OP5OKQQ.jpeg"),
    category: "hamburguesas",
  },
  // Burger faltante restaurada
  {
    id: 5,
    name: "Hamburguesa Doble Queso",
    price: 34.0,
    image: require("../assets/burger.png"),
    category: "hamburguesas",
  },
  // Bebidas
  {
    id: 6,
    name: "Fanta Lata",
    price: 5.0,
    image: require("../assets/Gaseosa-Fanta-Original-Lata-355-ml-1-120335414.webp"),
    category: "bebidas",
  },
  {
    id: 7,
    name: "Sprite Lata",
    price: 5.0,
    image: require("../assets/Gaseosa-Sprite-Lata-355ml-1-30792727.webp"),
    category: "bebidas",
  },
  {
    id: 8,
    name: "Inka Kola Lata",
    price: 3.5,
    image: require("../assets/dsc007859015-600x600.jpg"),
    category: "bebidas",
  },
  {
    id: 9,
    name: "Coca Cola Lata",
    price: 6.0,
    image: require("../assets/w=1500,h=1500,fit=pad.webp"),
    category: "bebidas",
  },
  {
    id: 10,
    name: "Pepsi Lata",
    price: 6.0,
    // Restaurar imagen, usar alternativa si la anterior faltaba
    image: require("../assets/w=1500,h=1500,fit=pad (1).webp"),
    category: "bebidas",
  },
];

export default function MenuScreen({ navigation, route }) {
  const [productos, setProductos] = useState([]);
  const [cart, setCart] = useState([]);
  const listRef = useRef(null);
  const [orderSuccessVisible, setOrderSuccessVisible] = useState(false);

  useEffect(() => {
    // Load all products; UI shows sections for comidas & bebidas
    setProductos(productosDemo);
  }, []);

  const screenHeight = Dimensions.get("window").height;
  const headerHeight = Math.round(screenHeight * 0.32);

  const addToCart = (item) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const total = cart.reduce((s, it) => s + it.price * it.qty, 0);

  useEffect(() => {
    if (route && route.params && route.params.orderSuccess) {
      setOrderSuccessVisible(true);
      // clear param so it doesn't re-trigger
      try {
        navigation.setParams({ orderSuccess: false });
      } catch (e) {}
      setTimeout(() => setOrderSuccessVisible(false), 3000);
    }
  }, [route]);

  const renderItem = ({ item }) => (
    <Card style={styles.itemCard}>
      <Card.Content style={styles.itemContent}>
        {item.image ? (
          <Image source={item.image} style={styles.itemImage} />
        ) : (
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
        )}
        <View style={styles.itemText}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text>S/{item.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </Card.Content>
    </Card>
  );

  const renderGridItem = ({ item }) => (
    <View style={styles.gridItem}>
      {item.image ? (
        <Image source={item.image} style={styles.gridImage} />
      ) : (
        <Image source={{ uri: item.image_url }} style={styles.gridImage} />
      )}
      <Text style={styles.gridTitle}>{item.name}</Text>
      <View style={styles.gridRow}>
        <Text style={styles.gridPrice}>S/{item.price}</Text>
        <TouchableOpacity
          style={styles.addSmall}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addSmallText}>Añadir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={productos.filter((p) => p.category === "hamburguesas")}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderGridItem}
        numColumns={2}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={[styles.gridList, { paddingBottom: 220 }]}
        ListHeaderComponent={() => (
          <>
            <ImageBackground
              source={HEADER_IMAGE}
              style={[styles.headerImageFull, { height: headerHeight }]}
              imageStyle={styles.headerImageStyle}
            >
              <View style={styles.headerOverlay} />
            </ImageBackground>
            <View style={styles.navRow}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  listRef.current?.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                }}
              >
                <Text>Comidas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => {
                  listRef.current?.scrollToEnd({ animated: true });
                }}
              >
                <Text>Bebidas</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => navigation.navigate("Reviews")}
              >
                <Text>Reseñas</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <View style={styles.titleRow}>
                <Text variant="headlineSmall" style={styles.title}>
                  Comidas
                </Text>
                <View style={styles.titleLine} />
              </View>
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <View style={{ paddingBottom: 100 }}>
            <View style={styles.section}>
              <View style={styles.titleRow}>
                <Text variant="headlineSmall" style={styles.title}>
                  Bebidas
                </Text>
                <View style={styles.titleLine} />
              </View>

              <FlatList
                data={productos.filter((p) => p.category === "bebidas")}
                keyExtractor={(i) => i.id.toString()}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bebidasList}
                ListEmptyComponent={<Text style={{padding:12}}>Sin bebidas</Text>}
              />
            </View>
          </View>
        )}
      />

      <View style={styles.cartBar}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartLabel}>Total</Text>
          <Text style={styles.cartTotal}>S/{total.toFixed(2)}</Text>
        </View>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("OrderSummary", { cart })}
          buttonColor="#7a4f1d"
          contentStyle={{ height: 44 }}
          style={styles.orderButton}
        >
          Ordenar
        </Button>
      </View>
      {orderSuccessVisible && (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Pedido realizado</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentContainer: { paddingHorizontal: 24 },
  headerImage: { width: "100%", height: 180, marginBottom: 8 },
  headerImageStyle: {
    resizeMode: "cover",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  headerImageFull: { width: "100%" },
  section: { marginTop: 12 },
  gridList: { paddingBottom: 220 },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#fff0",
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#ffffffcc",
    alignItems: "center",
  },
  brandRow: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  brandLogo: { width: 40, height: 40, resizeMode: "contain", marginRight: 8 },
  brandText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 20,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gridItem: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
  },
  gridImage: { width: "100%", height: 140, borderRadius: 6, marginBottom: 8 },
  gridTitle: { fontWeight: "700", marginBottom: 6 },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gridPrice: { fontWeight: "700" },
  addSmall: {
    backgroundColor: "#7a4f1d",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addSmallText: { color: "#fff" },
  bebidasList: { paddingVertical: 8, paddingLeft: 24 },
  title: {
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  titleLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#ddd",
    marginLeft: 12,
    borderRadius: 2,
  },
  list: { paddingBottom: 96 },
  itemCard: { marginBottom: 12, borderRadius: 8, overflow: "hidden" },
  itemContent: { flexDirection: "row", alignItems: "center" },
  itemImage: { width: 72, height: 72, borderRadius: 8, marginRight: 12 },
  itemText: { flex: 1 },
  itemTitle: { fontWeight: "700" },
  addButton: {
    backgroundColor: "#7a4f1d",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: { color: "#fff" },
  cartBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#e6c9a0",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 8,
  },
  cartInfo: { flex: 1 },
  cartLabel: { color: "#333" },
  cartTotal: { fontWeight: "700", fontSize: 16 },
  orderButton: { borderRadius: 40, marginLeft: 12 },
  contentCard: {
    marginTop: -34,
    backgroundColor: "#fff",
    borderRadius: 18,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
    elevation: Platform.OS === "android" ? 4 : 0,
  },
  successBanner: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 80,
    backgroundColor: "#e6f7ea",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    elevation: 6,
  },
  successText: { color: "#147a2e", fontWeight: "700" },
});
