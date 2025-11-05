import React, { useState, useEffect, act } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import ListaClientes from '../components/ListaClientes.js';
import FormularioClientes from '../components/FormularioClientes.js';
import TablaClientes from '../components/TablaClientes.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    gmail: "",
    telefono: "",
    cedula: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientes(data);
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
      const datos = await cargarDatosFirebase("Clientes");
      console.log("Datos cargados:", datos);

      //Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase_Clientes.txt";

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

  const eliminarCliente = async (id) => {
    try{
      await deleteDoc(doc(db, "Clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoCliente((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarCliente = async () => {
    try {
      if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.edad && nuevoCliente.gmail
          && nuevoCliente.telefono && nuevoCliente.cedula) {
        await addDoc(collection(db, "Clientes"), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          edad: parseFloat(nuevoCliente.edad),
          gmail: nuevoCliente.gmail,
          telefono: nuevoCliente.telefono,
          cedula: nuevoCliente.cedula,
        });
        cargarDatos(); //Recarga lista

        setNuevoCliente({nombre: "", apellido: "", edad: "", gmail: "", telefono: "", cedula: ""});
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar cliente: ", error);
    }
  };

  const actualizarCliente = async () => {
    try{
      if(nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.edad &&
          nuevoCliente.gmail && nuevoCliente.telefono && nuevoCliente.cedula) {
        
        await updateDoc(doc(db, "Clientes", clienteId), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          edad: parseFloat(nuevoCliente.edad),
          gmail: nuevoCliente.gmail,
          telefono: nuevoCliente.telefono,
          cedula: nuevoCliente.cedula,
        });

        setNuevoCliente({nombre: "", apellido: "", edad: "", gmail: "", telefono: "", cedula: ""});

        setModoEdicion(false); //Volver al modo registro
        setClienteId(null);

        cargarDatos(); //Recargar Lista
      } else {
        alert("Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar cliente: ", error);
    }
  };

  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      edad: cliente.edad.toString(),
      gmail: cliente.gmail,
      telefono: cliente.telefono,
      cedula: cliente.cedula,
    });
    setClienteId(cliente.id);
    setModoEdicion(true)
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
      />
      <ListaClientes clientes={clientes}/>
      <TablaClientes
        clientes={clientes}
        editarCliente={editarCliente}
        eliminarCliente={eliminarCliente}
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

export default Clientes;