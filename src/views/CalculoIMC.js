import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

import { ref, set, push, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig";

const CalculoIMC = () => {

  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [listaIMC, setListaIMC] = useState([]);
  const [resultado, setResultado] = useState(null);

  const guardarEnRT = async () => {
    if (!peso || !estatura) {
      alert("Rellena ambos campos");
      return;
    }

    const imc = calcularIMC(Number(peso), Number(estatura));

    try{ 
      const referencia = ref(realtimeDB, "imc_rt");
      const nuevoRef = push(referencia); //Crea ID automático

      await set(nuevoRef, {
        peso: Number (peso),
        estatura: Number (estatura),
        imc: Number(imc),
      });

      setPeso("");
      setEstatura("");
      setResultado(imc);

      alert("IMC guardado en Realtime");
    } catch (error) {
      console.log("Error al guardar:", error);
    }
  };

  const leerRT = () => {
    const referencia = ref(realtimeDB, "imc_rt");

    onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();

        //Convertir ese objeto en un array limpio
        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos,
        }));

        setListaIMC(lista);
      } else {
        setListaIMC([]);
      }
    });
  };

  // Función para calcular IMC
  const calcularIMC = (p, e) => {
    if (!p || !e) return null;
    const imc = p / (e * e);
    return imc.toFixed(2);
  };

  useEffect(() => {
    leerRT(); //Se conecta a los cambios en tiempo real
  }, []);

  const interpretarIMC = (imc) => {
    if (imc < 18.5) return "Bajo peso";
    if (imc < 24.9) return "Peso normal";
    if (imc < 29.9) return "Sobrepeso";
    return "Obesidad";
  };

  return (
    <View style = {styles.container}>
      <Text style={styles.titulo}>Calculo del Índice de Masa Corporal (IMC)</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingrese su peso en Kg"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <TextInput
        style={styles.input}
        placeholder="Ingrese su estatura en metros"
        keyboardType="numeric"
        value={estatura}
        onChangeText={setEstatura}
      />

      <Button title="Calcular y Guardar IMC" onPress={guardarEnRT} />

      {resultado && (
        <View style={styles.resultado}>
          <Text style={styles.resultadoTexto}>
            Tu IMC es: <Text style={styles.valor}>{resultado}</Text>
          </Text>
          <Text style={styles.resultadoTexto}>
            Clasificación: {interpretarIMC(resultado)}
          </Text>
        </View>
      )}

      <Text style={styles.subtitulo}>Historial de cálculos (Realtime)</Text>

       {listaIMC.length === 0 ? (
        <Text>No hay cálculos guardados</Text>
      ) : (
        listaIMC.map((item) => (
          <Text key={item.id}>
            Peso: {item.peso}kg - Estatura: {item.estatura}m - IMC:{" "}
            {item.imc} ({interpretarIMC(item.imc)})
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },
  subtitulo: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold"
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
    resultado: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e7f4e4",
    borderRadius: 5,
  },
  resultadoTexto: {
    fontSize: 16,
    textAlign: "center",
  },
  valor: {
    fontWeight: "bold",
  },
});

export default CalculoIMC;