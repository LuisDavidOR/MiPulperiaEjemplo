import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import TablaNumeros from '../components/Numeros/TablaNumeros.js';
import FormularioNumeros from '../components/Numeros/FormularioNumeros.js';
import TituloSuma from '../components/TituloSuma.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

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

  const cargarDatosFirebase =async (nombreColeccion) => {
    if (!nombreColeccion || typeof nombreColeccion !== 'string') {
      console.error("Error: Se requiere un nombre de colección válido.");
      return;
    }
    
    try {
      const datosExportados = {};

      //Obtener la referencia a la colección específica
      const snapshot = await getDocs(collection(db, nombreColeccion));

      //Mapear los documentos y agregarlos al objeto de resultados
      datosExportados[nombreColeccion] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return datosExportados;
    } catch (error) {
      console.error(`Error extrayendo datos de la colección '${nombreColeccion}':`, error);
    }
  };

  const exportarDatos = async () => {
    try {
      const datos = await cargarDatosFirebase("numeros");
      console.log("Datos cargados:", datos);

      //Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase_numeros.txt";

      //Copiar datos al portapapeles
      await Clipboard.setStringAsync(jsonString);
      console.log(" Datos (JSON) copiados al portapapeles.");

      //Verificar si la función de compartir está disponible
      if (!(await Sharing.isAvailableAsync())) {
        alert("La función Compartir/Guardar no está disponible en tu dispositivo");
        return;
      }

      //Guardar el archivo temporalmente
      const fileUri = FileSystem.cacheDirectory + baseFileName;

      //Escribir el contenido JSON en el caché temporal
      await FileSystem.writeAsStringAsync(fileUri, jsonString);

      //Abrir el diálogo de compartir
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/plain',
        dialogTitle: 'Compartir datos de Firebase (JSON)'
      });

      alert("Datos copiados al portapapeles y listos para compartir.");
    } catch (error) {
      console.error("Error al exportar y compartir:", error);
      alert("Error al exportar o compartir: " + error.massage);
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
      <View style={{marginVertical: 10}}>
        <Button title="Exportar" onPress={exportarDatos} />
      </View>
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