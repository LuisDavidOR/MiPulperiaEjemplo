import React, {useState} from "react";
import { View, TextInput, StyleSheet, Text, TouchableHighlight } from "react-native";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioNumeros = ({ cargarDatos }) => {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");

  const guardarNumero = async () => {
    if (num1 && num2) {
      try {
        await addDoc(collection(db, "numeros"), {
          num1: parseFloat(num1),
          num2: parseFloat(num2),
        });

        setNum1("");
        setNum2("");
        cargarDatos(); //Volver a cargar la lista
      } catch (error) {
        console.error("Error al registrar números: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Números</Text>

      <TextInput 
        style={styles.input}
        placeholder="Número 1"
        value={num1}
        onChangeText={setNum1}
        keyboardType="numeric"
      />
      <TextInput 
        style={styles.input}
        placeholder="Número 2"
        value={num2}
        onChangeText={setNum2}
        keyboardType="numeric"
      />

      <TouchableHighlight
        style={styles.boton}
        underlayColor="#0056b3"   // color al presionar
        onPress={guardarNumero}
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

export default FormularioNumeros;