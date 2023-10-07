import React, { useEffect, useState } from 'react';
import { app } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom';

const AuthCheck = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Comprueba si el usuario está autenticado
    const unsubscribe = app.auth().onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado
        setAuthenticated(true);
      } else {
        // Usuario no autenticado
        setAuthenticated(false);
        navigate('/'); // Redirige al inicio de sesión si no está autenticado
      }
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [navigate]);

  return authenticated ? <>{children}</> : null;
};

export default AuthCheck;