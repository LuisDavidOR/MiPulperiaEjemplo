import React, {useState} from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { doc, addDoc } from "firebase/firestore";

const FormularioClientes = ({
  nuevoCliente,
  manejoCambio,
  guardarCliente,
  actualizarCliente,
  modoEdicion
}) => {

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Cliente" : "Registro de Cliente"}
      </Text>

      <TextInput 
        style={styles.input}
        placeholder="Nombre del cliente"
        value={nuevoCliente.nombre}
        onChangeText={(nombre) => manejoCambio("nombre", nombre)}
      />
      <TextInput 
        style={styles.input}
        placeholder="Apellido del cliente"
        value={nuevoCliente.apellido}
        onChangeText={(apellido) => manejoCambio("apellido", apellido)}
      />
      <TextInput 
        style={styles.input}
        placeholder="Gmail"
        value={nuevoCliente.gmail}
        onChangeText={(gmail) => manejoCambio("gmail", gmail)}
      />
      <TextInput 
        style={styles.input}
        placeholder="Edad"
        value={nuevoCliente.edad}
        onChangeText={(edad) => manejoCambio("edad", edad)}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Teléfono"
        value={nuevoCliente.telefono}
        onChangeText={(telefono) => manejoCambio("telefono", telefono)}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Cédula"
        value={nuevoCliente.cedula}
        onChangeText={(cedula) => manejoCambio("cedula", cedula)}
      />

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarCliente : guardarCliente}
      />

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