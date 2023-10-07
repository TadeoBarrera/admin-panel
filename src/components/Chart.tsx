import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';
import firebase from 'firebase/compat/app';


export default function Chart() {
  const [usuarioActivo, setUsuarioActivo] = React.useState<firebase.User | null>(null);
  const [data, setData] = React.useState<unknown[]>([]); // Inicializa data como un arreglo vacío
console.log(data)

React.useEffect(() => {
  const fetchData = async () => {
    try {
      const snapshot = await firebase.firestore().collection('listaDifusion').get();
      const newData: unknown[] = [];
      const dayData: { [day: string]: number } = {}; // Objeto para agrupar datos por día

      snapshot.forEach((doc) => {
        const timestamp = doc.data().favoritos;
        const date = new Date(timestamp.seconds * 1000);
        const formattedDay = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}, ${date.getFullYear()}`;

        if (!dayData[formattedDay]) {
          dayData[formattedDay] = 0;
        }

        dayData[formattedDay] += 1; // Incrementa la cantidad de usuarios para este día
      });

      // Convierte el objeto de datos por día en un arreglo de objetos
      Object.entries(dayData).forEach(([day, amount]) => {
        newData.push({
          time: day,
          amount,
        });
      });

      setData(newData);
    } catch (error) {
      console.error('Error al obtener los datos de Firestore: ', error);
    }
  };

  fetchData();
}, []);

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUsuarioActivo(user);
      } else {
        setUsuarioActivo(null)
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  console.log(usuarioActivo)
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Today</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
            domain={[0, 5]} // Establece el dominio del eje Y de 0 a 5
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Users
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}