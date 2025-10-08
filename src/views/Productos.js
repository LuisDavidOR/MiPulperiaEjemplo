import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import ListaProductos from '../components/ListaProductos.js';
import FormularioProductos from '../components/FormularioProductos';
import TablaProductos from '../components/TablaProductos.js';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
  });

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