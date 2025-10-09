import React, { useState, useEffect, act } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import ListaClientes from '../components/ListaClientes.js';
import FormularioClientes from '../components/FormularioClientes.js';
import TablaClientes from '../components/TablaClientes.js';

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