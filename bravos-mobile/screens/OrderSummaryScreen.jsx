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
