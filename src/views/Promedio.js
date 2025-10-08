import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import TituloPromedio from '../components/TituloPromedio.js';
import FormularioEdades from '../components/Edades/FormularioEdades.js';
import TablaEdades from '../components/Edades/TablaEdades.js';

const Promedio = () => {
  const [edades, setEdades] = useState([]);
  const [promedio, setPromedio] = useState(null);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "edades"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEdades(data);
      //Una vez que se cargan las edades, llama al método de calculo con la API
      if(data.length > 0){
        calcularPromedioAPI(data);
      } else {
        setPromedio(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarEdad = async (id) => {
    try{
      await deleteDoc(doc(db, "edades", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  const calcularPromedioAPI = async (lista) => {
    try {
      const response = await fetch("https://t3qtl6lia2.execute-api.us-east-2.amazonaws.com/calcular-promedio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ edades: lista }),
      });

      const data = await response.json();
      setPromedio(data.promedio || null);
    } catch (error) {
      console.error("Error al calcular el promedio en API:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloPromedio promedio={promedio} />
      <FormularioEdades cargarDatos={cargarDatos}/>
      <TablaEdades
        edades={edades}
        eliminarEdad={eliminarEdad}
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

export default Promedio;