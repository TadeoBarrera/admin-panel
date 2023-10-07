import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { db } from '../config/firebase-config';
import firebase from 'firebase/compat/app';



interface OrderData {
  date: string;
  name: string;
  shipTo: string;
  correoUsuario: string;
  telefono: number;
}

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders() {
    const [data, setData] = React.useState<OrderData[]>([]);
    const [usuarioActivo, setUsuarioActivo] = React.useState<firebase.User | null>(null); // Define usuarioActivo con el tipo adecuado

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
        if (usuarioActivo !== null) {
          const fetchData = async () => {
            try {
              const querySnapshot = await db.collection('listaDifusion')
                .where('correo', '==', usuarioActivo.email)
                .get();
    
              const dataList: OrderData[] = []; // Usa el tipo de datos definido
    
              querySnapshot.forEach((doc) => {
                const data = doc.data() as OrderData; // Asegura que los datos coincidan con el tipo
                dataList.push(data);
              });
    
              setData(dataList);
            } catch (error) {
              console.error('Error al cargar datos desde Firestore:', error);
            }
          };
    
          fetchData();
        }
      }, [usuarioActivo]);

      console.log(data)
      return (
        <React.Fragment>
          <Title>Recent Followers</Title>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Ubication</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="right">Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: OrderData, index: number) => (
                <TableRow key={index}>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.shipTo}</TableCell>
                  <TableCell>{row.correoUsuario}</TableCell>
                  <TableCell align="right">{row.telefono}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
            See more orders
          </Link>
        </React.Fragment>
      );
  
}