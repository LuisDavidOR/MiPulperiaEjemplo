import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import ListaProductos from '../components/ListaProductos.js';
import FormularioProductos from '../components/FormularioProductos';
import TablaProductos from '../components/TablaProductos.js';

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

  const eliminarProducto = async (id) => {
    try{
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioProductos cargarDatos={cargarDatos}/>
      <ListaProductos productos={productos}/>
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
      />
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