import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarNumero from "./BotonEliminarNumero";

const TablaNumeros = ({ numeros, eliminarNumero }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Números</Text>

      {/*Encabezado de la tabla */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Num1</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Num2</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Suma</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido de la tabla */}
      <ScrollView>
        {numeros.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.num1}</Text>
            <Text style={styles.celda}>{item.num2}</Text>
            <Text style={styles.celda}>{item.num1 + item.num2}</Text>
            {/* Celda de acciones */}
            <View style={[styles.celdaAcciones]}>
              <BotonEliminarNumero id={item.id} eliminarNumero={eliminarNumero} />
            </View>
          </View>
        ))}
      </ScrollView>

      
    </View>
  )
}

const styles= StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch"
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    alignItems: 'center'
  },
  encabezado: {
    backgroundColor: '#f0f0f0'
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center'
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  textoEncabezado: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center'
  },
});

export default TablaNumeros;