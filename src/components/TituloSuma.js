import React from "react";
import { Text, StyleSheet } from 'react-native';

const TituloSuma = ({ suma }) => {
  return(
    <Text style={styles.titulo}>
      {suma !=null
        ? `Suma: ${suma.toFixed(2)}`
        : "Sin datos para calcular suma"}
    </Text>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center"
  },
});

export default TituloSuma;