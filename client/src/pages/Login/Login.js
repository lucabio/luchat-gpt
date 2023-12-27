import React, { useEffect } from 'react';
import './Login.css'; // Stili specifici per la pagina di login
import axios from 'axios';

function Login() {
    useEffect(() => {
        const getLoginUrl = async () => {
            try {
                const response = await axios.get('http://localhost:3000/auth/login');
                console.log('response', response.data) ;
                window.location.href = response.data; // Reindirizza alla pagina di login di Cognito
            } catch (error) {
                console.error('Errore nel recupero dell\'URL di login:', error);
                // Gestisci l'errore qui
            }
        };

        getLoginUrl();

    }, []);


  return (
    <div className="login-container">
      {/* Contenuto della pagina di login */}
      <h1>Login</h1>
      {/* Aggiungi form di login, pulsanti, ecc. */}
    </div>
  );
}

export default Login;