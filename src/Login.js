import { Switch } from "@mui/material";
import React, { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import CustomizedTables from "./components/Dashboard2";
import Home from "./components/Home";
import DashboardFinal from "./components/DashboardFinal";
import { gapi } from 'gapi-script';
const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

function Login() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const navigate = useNavigate();
  const onLoginSuccess = (res) => {
    console.log("Login Success:", res.profileObj);
    const flag = 0;
    if (flag === -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      navigate("/home");
      auth2.signOut();
      
    }
    else{
      // {console.log(res.profileObj.imageUrl)}
      navigate("/dashboard", { state: { emailid: res.profileObj.email, userimage: "https://lh3.googleusercontent.com/a-/AOh14GhdtfLv7IHR0Si2U7jt4r8g227__Htm_k3G1gjf_Q=s96-c"}});
      // console.log(res);
      setShowloginButton(false);
      setShowlogoutButton(true);
    }

  };

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  const onSignoutSuccess = () => {
    alert("You have been logged out successfully");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
    navigate("/home");
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
          cookiePolicy={"single_host_origin"}
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

