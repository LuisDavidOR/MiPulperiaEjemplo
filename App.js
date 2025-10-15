import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './src/database/firebaseconfig';
import Productos from "./src/views/Productos";
import Clientes from './src/views/Clientes';
import Promedio from './src/views/Promedio';
import { FlatList, View } from 'react-native';
import SumaNumeros from './src/views/SumaNumeros';
import Usuarios from './src/views/Usuarios';
import Login from './src/components/Login';

const App = () => {
  const data = [
    { key: 'productos', component: <Productos cerrarSesion={cerrarSesion} /> },
    { key: 'clientes', component: <Clientes cerrarSesion={cerrarSesion} /> },
    { key: 'usuarios', component: <Usuarios cerrarSesion={cerrarSesion} /> },
    { key: 'promedio', component: <Promedio cerrarSesion={cerrarSesion} /> },
    { key: 'sumaNumeros', component: <SumaNumeros cerrarSesion={cerrarSesion} /> }
  ];

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    //Escucha los cambios en la autenticación (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    //Si no hay usuario autenticado, mostrar login
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  //Si hay usuario autenticado, mostrar productos
  return (
    <View style={{ flex: 1 }}>
      <Productos cerrarSesion={cerrarSesion} />
    </View>
  );
};

export default App;