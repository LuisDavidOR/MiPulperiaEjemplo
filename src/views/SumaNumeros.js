import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import TablaNumeros from '../components/Numeros/TablaNumeros.js';
import FormularioNumeros from '../components/Numeros/FormularioNumeros.js';
import TituloSuma from '../components/TituloSuma.js';

const SumaNumeros = () => {
  const [numeros, setNumeros] = useState([]);
  const [suma, setSuma] = useState(null);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "numeros"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNumeros(data);
      //Una vez que se cargan los números, llama al método de calculo con la API
      if(data.length > 0){
        calcularSumaAPI(data);
      } else {
        setSuma(null);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarNumero = async (id) => {
    try{
      await deleteDoc(doc(db, "numeros", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  const calcularSumaAPI = async (lista) => {
    try {
      const response = await fetch("https://t3qtl6lia2.execute-api.us-east-2.amazonaws.com/suma-numeros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numeros: lista }),
      });

      const data = await response.json();
      setSuma(data.suma || null);
    } catch (error) {
      console.error("Error al calcular el promedio en API:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TituloSuma suma={suma} />
      <FormularioNumeros cargarDatos={cargarDatos}/>
      <TablaNumeros
        numeros={numeros}
        eliminarNumero={eliminarNumero}
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

export default SumaNumeros;