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
import CustomizedTable from "./components/ProjectsTable";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { gapi } from 'gapi-script';
const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

function Login() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const navigate = useNavigate();
  const onLoginSuccess = async (res) => {
    console.log("Login Success:", res.profileObj);
     var server_address = "http://localhost:5000/user/" + res.profileObj.email;
     const resp = await fetch(server_address, {
       method: "GET",
       headers: { "Content-Type": "application/json" },
      
     });
     const response = await resp.json();
     console.log("Server response" , response);
    const flag = response;
    if (flag == -1) {
      var auth2 = gapi.auth2.getAuthInstance();
      alert("You are not a valid USER!!");
      navigate("/home");
      auth2.signOut();
      
      
    }
    
    else{
    //  console.log("This is: ", flag);
      navigate("/dashboard", { state: { userName:res.profileObj.givenName,userImg:res.profileObj.imageUrl,userEmail:res.profileObj.email, userFlag: flag}});
      console.log(res.profileObj);
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

