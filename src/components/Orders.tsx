import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { db } from '../config/firebase-config';
import firebase from 'firebase/compat/app';
import Button from '@mui/material/Button';

import * as ExcelJS from 'exceljs';

interface OrderData {
  date: string;
  name: string;
  shipTo: string;
  correoUsuario: string;
  telefono: number;
}


export default function Orders() {
    const [data, setData] = React.useState<OrderData[]>([]);
    const [usuarioActivo, setUsuarioActivo] = React.useState<firebase.User | null>(null); // Define usuarioActivo con el tipo adecuado

    React.useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            setUsuarioActivo(user);
          } else {
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

      const exportToExcel = () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Follower Data');
    
        // Agregar encabezados
        worksheet.addRow(['Date', 'Name', 'Ubication', 'Email', 'Phone']);
    
        // Agregar datos
        data.forEach((row) => {
          worksheet.addRow([row.date, row.name, row.shipTo, row.correoUsuario, row.telefono]);
        });
    
        // Aplicar estilos (puedes personalizar esto según tus necesidades)
        worksheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });
    
        // Crear el archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'follower_data.xlsx';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      };

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
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={exportToExcel}>
        Download Excel
      </Button>
        </React.Fragment>
      );
  
}