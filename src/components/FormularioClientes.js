import React, {useState} from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioClientes = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [gmail, setGmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [edad, setEdad] = useState("");
  const [cedula, setCedula] = useState("");

  const guardarCliente = async () => {
    if (nombre && apellido && gmail && edad && telefono && cedula) {
      try {
        await addDoc(collection(db, "Clientes"), {
          nombre: nombre,
          apellido: apellido,
          gmail: gmail,
          telefono: telefono,
          edad: edad,
          cedula: cedula,
        });
        setNombre("");
        setApellido("");
        setGmail("");
        setEdad("");
        setTelefono("");
        setCedula("");
        cargarDatos(); //Volver a cargar la lista
      } catch (error) {
        console.error("Error al registrar cliente: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Clientes</Text>

      <TextInput 
        style={styles.input}
        placeholder="Nombre del cliente"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput 
        style={styles.input}
        placeholder="Apellido del cliente"
        value={apellido}
        onChangeText={setApellido}
      />
      <TextInput 
        style={styles.input}
        placeholder="Gmail"
        value={gmail}
        onChangeText={setGmail}
      />
      <TextInput 
        style={styles.input}
        placeholder="Edad"
        value={edad}
        onChangeText={setEdad}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Teléfono"
        value={telefono}
        onChangeText={setTelefono}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Cédula"
        value={cedula}
        onChangeText={setCedula}
      />

      <Button title='Guardar' onPress={guardarCliente}/>

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

export default FormularioClientes;