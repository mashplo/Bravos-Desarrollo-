import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, TouchableOpacity } from 'react-native';

const productosDemo = [
  { id: 0, name: 'Smash Burguer', price: 5.99, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { id: 1, name: 'Bacon Burguer', price: 6.99, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Coca cola', price: 1.99, image_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Inka cola', price: 0.99, image_url: 'https://mir-s3-cdn-cf.behance.net/projects/404/069e01209605969.Y3JvcCw0MjI1LDMzMDUsOTYyLDA.gif' },
];

export default function MenuScreen({ navigation }) {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Aquí podrías hacer fetch a la API, por ahora demo
    setProductos(productosDemo);
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>Comidas</Text>
      <FlatList
        data={productos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 8 }}>
            <Image source={{ uri: item.image_url }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ fontSize: 16 }}>S/{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Button title="Ordenar" onPress={() => navigation.navigate('OrderSummary')} />
    </View>
  );
}
