import React from 'react';
import Productos from "./src/views/Productos";
import Clientes from './src/views/Clientes';
import Promedio from './src/views/Promedio';
import { FlatList } from 'react-native';
import SumaNumeros from './src/views/SumaNumeros';
import Usuarios from './src/views/Usuarios';

const App = () => {
  const data = [
    { key: 'productos', component: <Productos /> },
    { key: 'clientes', component: <Clientes /> },
    { key: 'usuarios', component: <Usuarios /> },
    { key: 'promedio', component: <Promedio /> },
    { key: 'sumaNumeros', component: <SumaNumeros /> }
  ];

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => item.component}
    />
  );
};

export default App;