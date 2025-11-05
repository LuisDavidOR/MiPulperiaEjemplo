import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import TituloPromedio from '../components/TituloPromedio.js';
import FormularioEdades from '../components/Edades/FormularioEdades.js';
import TablaEdades from '../components/Edades/TablaEdades.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

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
      const datos = await cargarDatosFirebase("edades");
      console.log("Datos cargados:", datos);

      //Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase_edades.txt";

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

export default Promedio;