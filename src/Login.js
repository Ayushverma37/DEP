import { Switch } from "@mui/material";
import React, { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import CustomizedTables from "./components/Dashboard2";
import Home from "./components/Home";
import DashboardFinal from "./components/DashboardFinal";

const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

function Login() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const navigate = useNavigate();
  const onLoginSuccess = (res) => {
    console.log("Login Success:", res.profileObj);
    navigate("/dashboard");
    setShowloginButton(false);
    setShowlogoutButton(true);
  };

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  const onSignoutSuccess = () => {
    alert("You have been logged out successfully");
    navigate("/home");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
  };

  return (
    <div>
      {showloginButton ? (
        <GoogleLogin 
          clientId={clientId}
          render={(renderProps) => (
            <button className="loginButton" onClick={renderProps.onClick} disabled={renderProps.disabled}>
            LOGIN
             </button>)}
          
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={"single_host_origin"}
          isSignedIn={true}
        />
      ) : null}

      {showlogoutButton ? (
        <GoogleLogout
          clientId={clientId}
          buttonText="Sign Out"
          onLogoutSuccess={onSignoutSuccess}
        ></GoogleLogout>
      ) : null}
    </div>
  );
}
export default Login;
