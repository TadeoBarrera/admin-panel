import * as React from 'react';
import Typography from '@mui/material/Typography';
import Title from './Title';
import { db } from '../config/firebase-config';
import firebase from 'firebase/compat/app';


export default function Deposits() {
  const [depositCount, setDepositCount] = React.useState(0);
  const [usuarioActivo, setUsuarioActivo] = React.useState<firebase.User | null>(null); // Define usuarioActivo con el tipo adecuado
  const [currentDate, setCurrentDate] = React.useState('');

  React.useEffect(() => {
    // Escucha el cambio de estado de autenticación
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado, establece usuarioActivo
        setUsuarioActivo(user);
      } else {
        // No hay usuario autenticado, usuarioActivo es null
        setUsuarioActivo(null)
      }
    });

    return () => {
      // Limpia la suscripción al desmontar el componente
      unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (usuarioActivo) {
      // Consulta Firestore para contar documentos donde correo == usuarioActivo.email
      db.collection('listaDifusion')
        .where('correo', '==', usuarioActivo.email)
        .get()
        .then((querySnapshot) => {
          // Obtiene el número de documentos en el resultado de la consulta
          const count = querySnapshot.size;
          setDepositCount(count);
        })
        .catch((error) => {
          console.error('Error al contar los documentos en Firestore:', error);
        });
    }
    const today = new Date();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const formattedDate = `${today.getDate()} ${monthNames[today.getMonth()]}, ${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, [usuarioActivo]);

  return (
    <React.Fragment>
      <Title>Recent Users</Title>
      <Typography component="p" variant="h4">
      {depositCount}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
      on {currentDate}
      </Typography>
      
    </React.Fragment>
  );
}