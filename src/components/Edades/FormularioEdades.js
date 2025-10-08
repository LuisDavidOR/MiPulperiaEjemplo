import React, {useState} from "react";
import { View, TextInput, Button, StyleSheet, Text, TouchableHighlight } from "react-native";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioEdades = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const guardarEdad = async () => {
    if (nombre && edad) {
      try {
        await addDoc(collection(db, "edades"), {
          nombre: nombre,
          edad: parseInt(edad),
        });

        setNombre("");
        setEdad("");
        cargarDatos(); //Volver a cargar la lista
      } catch (error) {
        console.error("Error al registrar edad: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Edades</Text>

      <TextInput 
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput 
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <TouchableHighlight
        style={styles.boton}
        underlayColor="#0056b3"   // color al presionar
        onPress={guardarEdad}
      >
        <Text style={styles.textoBoton}>Guardar</Text>
      </TouchableHighlight>

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
  boton: {
    backgroundColor: "#007BFF",  // azul por defecto
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  textoBoton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default FormularioEdades;