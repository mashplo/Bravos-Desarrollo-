import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';

const reseñasDemo = [
  { id: 1, usuario: 'Kiara Miranda', texto: 'La mejor hamburguesa que he probado.', estrellas: 5 },
  { id: 2, usuario: 'Camilo Micoló', texto: 'Excelente atención y sabor.', estrellas: 4 },
  { id: 3, usuario: 'Ignacio Chavez', texto: 'Muy buena experiencia.', estrellas: 5 },
];

export default function ReviewsScreen() {
  const [reseñas, setReseñas] = useState([]);

  useEffect(() => {
    // Aquí podrías hacer fetch a la API, por ahora demo
    setReseñas(reseñasDemo);
  }, []);

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>Reseñas</Text>
      <FlatList
        data={reseñas}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.usuario}</Text>
            <Text style={{ marginBottom: 4 }}>{item.texto}</Text>
            <Text style={{ color: '#e6c900' }}>{'★'.repeat(item.estrellas)}</Text>
          </View>
        )}
      />
    </View>
  );
}
