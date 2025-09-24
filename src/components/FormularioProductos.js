import React, {useState} from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioProductos = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState("");

  const guardarProducto = async () => {
    if (nombre && precio && descripcion && stock) {
      try {
        await addDoc(collection(db, "Productos"), {
          nombre: nombre,
          precio: parseFloat(precio),
          descripcion: descripcion,
          stock: parseFloat(stock),
        });
        setNombre("");
        setPrecio("");
        setDescripcion("");
        setStock("");
        cargarDatos(); //Volver a cargar la lista
      } catch (error) {
        console.error("Error al registrar producto: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Productos</Text>

      <TextInput 
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput 
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />
      <TextInput 
        style={styles.input}
        placeholder="Stock"
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <Button title='Guardar' onPress={guardarProducto}/>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  input: {
    borderRadius: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10
  },
});

export default FormularioProductos;