import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from './src/database/firebaseconfig';
import { collection, getDocs } from 'firebase/firestore';

export default function App() {

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const fetchDataproductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        //Preparación para subcolecciones (se ejecutará solo si existen)
        const productosConSubcoleccion = await Promise.all(data.map(async (item)=> {
          const subcoleccionSnapshot = await getDocs(collection(db, "Productos", item.id, "Sabores")).catch(() => []);
          const subcoleccionData = subcoleccionSnapshot.docs.map(subDoc => ({
            id: subDoc.id,
            ...subDoc.data(),
            parentId: item.id,
          }));
          return subcoleccionData.length > 0 ? { ...item, sabores: subcoleccionData} : item;
        }));

        setProductos(productosConSubcoleccion);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    const fetchDataclientes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Clientes"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

  useEffect(() => {
    fetchDataproductos();
    fetchDataclientes();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.titulo}>Lista de Productos</Text>
        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text style={styles.item}>
              {item.nombre} - ${item.precio}
              </Text>
              {item.sabores && item.sabores.length > 0 && (
                <FlatList
                  data={item.sabores}
                  keyExtractor={(subItem) => subItem.id}
                  renderItem={({ item: subItem}) => (
                  <Text style={[styles.item, {marginLeft: 20}]}>
                    Sabor: {subItem.sabor}
                  </Text>
                  )}
                />
              )}
            </View>
          )}
        />
      </View>
      <Text style={styles.titulo}>Lista de Clientes</Text>
      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.item}>
             <Text style={styles.textbold}>Nombre: </Text>
             {item.nombre} {item.apellido}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textbold: {
    fontWeight: "bold",
  },
  item: {
    fontSize: 18,
    marginBottom: 5,
  },
});
