import React from 'react';
import Productos from "./src/views/Productos";
import Clientes from './src/views/Clientes';
import { ScrollView } from 'react-native';

export default function App() {

  return (
    <>
    <ScrollView>
        <Productos />
        <Clientes />
    </ScrollView>
    </>
  );
}
