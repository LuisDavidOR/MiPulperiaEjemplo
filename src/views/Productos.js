import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs } from 'firebase/firestore';
import ListaProductos from '../components/ListaProductos.js';
import FormularioProductos from '../components/FormularioProductos';

const Productos = () => {
  const [productos, setProductos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioProductos cargarDatos={cargarDatos}/>
      <ListaProductos productos={productos}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Productos;