import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/database/firebaseconfig';

import Productos from './src/views/Productos';
import Clientes from './src/views/Clientes';
import Usuarios from './src/views/Usuarios';
import Promedio from './src/views/Promedio';
import SumaNumeros from './src/views/SumaNumeros';
import Login from './src/components/Login';

const App = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Lista de vistas
  const data = [
    { key: 'productos', component: <Productos cerrarSesion={cerrarSesion} /> },
    { key: 'clientes', component: <Clientes /> },
    { key: 'usuarios', component: <Usuarios /> },
    { key: 'promedio', component: <Promedio /> },
    { key: 'sumaNumeros', component: <SumaNumeros /> },
  ];

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.component}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
    </View>
  );
};

export default App;
