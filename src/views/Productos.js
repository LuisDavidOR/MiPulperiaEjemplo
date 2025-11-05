import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, orderBy, limit, query, where } from 'firebase/firestore';
import ListaProductos from '../components/ListaProductos.js';
import FormularioProductos from '../components/FormularioProductos';
import TablaProductos from '../components/TablaProductos.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Productos = ( {cerrarSesion} ) => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
  });
  const colecciones = ["Productos", "Usuarios", "edades", "Ciudades", "numeros", "Clientes"];

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

  const cargarTodosLosDatosFirebase = async () => {
    try {
      const datosExportados = {};

      for (const col of colecciones) {
        const snapshot = await getDocs(collection(db, col));

        datosExportados[col] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
      return datosExportados;
    } catch (error) {
      console.error("Error extrayendo datos:", error);
    }
  };

  const exportarTodosLosDatos = async () => {
    try {
      const datos = await cargarTodosLosDatosFirebase();
      console.log("Datos cargados:", datos);

      //Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase_productos.txt";

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
      const datos = await cargarDatosFirebase("Productos");
      console.log("Datos cargados:", datos);

      //Formatea los datos para el archivo y el portapapeles
      const jsonString = JSON.stringify(datos, null, 2);

      const baseFileName = "datos_firebase_productos.txt";

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

  const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 1 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    }
    catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta2 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where ("pais", "==", "Honduras"),
        where ("poblacion", ">", 700),
        orderBy ("nombre", "asc"),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 2 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta3 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where ("pais", "==", "El Salvador"),
        orderBy ("poblacion", "asc"),
        limit(2)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 3 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta4 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where ("poblacion", "<=", 300),
        orderBy("poblacion", "asc"),
        orderBy ("pais", "desc"),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 4 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta5 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where ("poblacion", ">", 900),
        orderBy("poblacion", "asc"),
        orderBy ("nombre", "asc"),
        limit(3)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 5 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta6 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy ("poblacion", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 6 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta7 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        where("poblacion", ">=", 200),
        where("poblacion", "<=", 600),
        orderBy ("pais", "asc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 7 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const pruebaConsulta8 = async () => {
    try {
      const q = query(
        collection(db, "Ciudades"),
        orderBy ("region", "desc"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      console.log("---------- Consulta 8 ----------");
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, País: ${data.pais}, Nombre: ${data.nombre}, poblacion: ${data.poblacion}k`)
      });
    } catch (error) {
      console.error("Error al hacer la consulta:", error);
    }
  }

  const eliminarProducto = async (id) => {
    try{
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio && nuevoProducto.descripcion && nuevoProducto.stock) {
        await addDoc(collection(db, "Productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
          descripcion: nuevoProducto.descripcion,
          stock: parseFloat(nuevoProducto.stock),
        });
        cargarDatos(); //Recarga lista

        setNuevoProducto({nombre: "", precio: "", descripcion: "", stock: ""});
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto: ", error);
    }
  };

  const actualizarProducto = async () => {
    try{
      if(nuevoProducto.nombre && nuevoProducto.precio && nuevoProducto.descripcion && nuevoProducto.stock) {
        
        await updateDoc(doc(db, "Productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
          descripcion: nuevoProducto.descripcion,
          stock: parseFloat(nuevoProducto.stock),
        });

        setNuevoProducto({nombre: "", precio: "", descripcion: "", stock: ""});

        setModoEdicion(false); //Volver al modo registro
        setProductoId(null);

        cargarDatos(); //Recargar Lista
      } else {
        alert("Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar producto: ", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
      descripcion: producto.descripcion,
      stock: producto.stock.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true)
  };

  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
    pruebaConsulta2();
    pruebaConsulta3();
    pruebaConsulta4();
    pruebaConsulta5();
    pruebaConsulta6();
    pruebaConsulta7();
    pruebaConsulta8();
  }, []);

  return (
    <View style={styles.container}>
      
      <FormularioProductos
       nuevoProducto={nuevoProducto}
       manejoCambio={manejoCambio}
       guardarProducto={guardarProducto}
       actualizarProducto={actualizarProducto}
       modoEdicion={modoEdicion}
      />
      <ListaProductos productos={productos}/>
      <TablaProductos
        productos={productos}
        editarProducto={editarProducto}
        eliminarProducto={eliminarProducto}
      />
      <View style={{marginVertical: 10}}>
        <Button title="Exportar" onPress={exportarDatos} />
      </View>
      <View style={{marginVertical: 10}}>
        <Button title="Exportar todos los datos" onPress={exportarTodosLosDatos} />
      </View>
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
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