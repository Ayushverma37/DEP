import { Switch } from '@mui/material';
import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import CustomizedTable from './components/ProjectsTable';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import { gapi } from 'gapi-script';
const clientId = `${process.env.REACT_APP_OAuth_CLIENT_ID}`;
const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;
function Login() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const navigate = useNavigate();
  const onLoginSuccess = async (res) => {
    const resp2 = await fetch(`${BACKEND_URL}/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: res.tokenId, email: res.profileObj.email }),
    });

    const jwt_data = await resp2.json();

    if (jwt_data == -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      alert('You are not a valid USER!!');
      navigate('/');
      auth2.signOut();

      return;
    }

    // the token received from the backend

    // setting the token in local storage
    localStorage.setItem('token', jwt_data.token);

    const resp34 = await fetch(`${BACKEND_URL}/test_temp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({}),
    });

    const data34 = await resp34.json();

    const resp = await fetch(`${BACKEND_URL}/user/${res.profileObj.email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
    });
    const response = await resp.json();
    const flag = response;
    if (flag == -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      alert('You are not a valid USER!!');
      navigate('/');
      auth2.signOut();
    } else {
      navigate('/dashboard', {
        state: {
          userName: res.profileObj.givenName,
          userImg: res.profileObj.imageUrl,
          userEmail: res.profileObj.email,
          userFlag: flag,
        },
      });
      setShowloginButton(false);
      setShowlogoutButton(true);
    }
  };

  const onLoginFailure = () => {};

  const onSignoutSuccess = () => {
    alert('You have been logged out successfully');
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <div>
      {showloginButton ? (
        <GoogleLogin
          clientId={clientId}
          render={(renderProps) => (
            <button
              className="loginButton"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              LOGIN
            </button>
          )}
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
        />
      ) : null}

      {showlogoutButton ? (
        <GoogleLogout
          clientId={clientId}
          render={(renderProps) => (
            <button
              className="loginButton"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Logout
            </button>
          )}
          buttonText="Sign Out"
          onLogoutSuccess={onSignoutSuccess}
        ></GoogleLogout>
      ) : null}
    </div>
  );
}
export default Login;
