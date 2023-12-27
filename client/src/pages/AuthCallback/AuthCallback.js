import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
    const navigate = useNavigate();

    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(`urlParams, ${urlParams}`);
        const code = urlParams.get('code');

        if (code) {
            axios.post('http://localhost:3000/auth/authenticate', {
                code: code
            }).then((response) => {

                console.log(`tokens, ${response.data}`);
                const tokens = response.data;

                localStorage.setItem('accessToken', tokens.access_token);
                localStorage.setItem('idToken', tokens.id_token);
                localStorage.setItem('refreshToken', tokens.refresh_token);

                setRedirectTo('/intelaigen-chat');
            }).catch((error) => {
                console.error(error);
                //setRedirectTo('/login');
            });
        }

        // const accessToken = urlParams.get('accessToken');
        // const idToken = urlParams.get('idToken');
        // const refreshToken = urlParams.get('refreshToken');

        // if (accessToken && idToken && refreshToken) {
            
        //     localStorage.setItem('accessToken', accessToken);
        //     localStorage.setItem('idToken', idToken);
        //     localStorage.setItem('refreshToken', refreshToken);

        //     setRedirectTo('/intelaigen-chat');
        // } else {
        //     setRedirectTo('/login');
        // }
    }, []);

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    }, [redirectTo, navigate]);

    return (
        <div>
            <p>Processing authentication...</p>
        </div>
    );
}

export default AuthCallback;
