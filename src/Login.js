import React, { useState } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";

const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

function Login() {
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const onLoginSuccess = async(res) => {
    console.log("Login Success:", res.profileObj);
    var server_address = "http://localhost:5000/" + res.profileObj.email;
    const response = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if(response != -1)
    {
        setShowloginButton(false);
        setShowlogoutButton(true);
    }
    else{
        onSignoutSuccess();
        logout();
    }
    
  };

  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };

  var logout = function() {
    document.location.href = "http://localhost:3000/";
}
  const onSignoutSuccess = () => {
    alert("You have been logged out successfully");
    console.clear();
    setShowloginButton(true);
    setShowlogoutButton(false);
  };

  return (
    <div>
      {showloginButton ? (
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign In"
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
