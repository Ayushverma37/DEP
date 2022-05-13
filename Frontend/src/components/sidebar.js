import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {FaHome,FaUserMinus,FaUsersCog} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';
import { GoogleLogout } from "react-google-login";




const drawerWidth = 15;
const clientId =
  "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com";

export default function PermanentDrawerLeft(props) {
  const navigate=useNavigate();
  
  const onSignoutSuccess = () => {
    
    alert("You have been logged out successfully");
    
    navigate("/home");
    window.location.reload();
  };
  const logout= () =>{
    
    gapi.load('auth2', function() {
      gapi.auth2.init();
    });
      var auth2 = gapi.auth2.getAuthInstance();
      navigate("/home");
      console.log("LOGOUT");
      auth2.signOut();
      window.location.reload();
  
      alert("Logged out successfully");
   

  
  }
  const toDashboard= () =>{
    
    navigate("/dashboard", { state: { userName:props.userName,userImg:props.userImg,userEmail:props.userEmail, userFlag: props.userFlag}});

   
   

    
  }
  const toManageUser=async () =>{
    

    var server_address = "http://localhost:5000/user/" + props.userEmail;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);

    if(response != 1){
      alert("YOU ARE NOT THE ADMIN");
      return;
    }

    navigate("/manageuser", { state: { userName:props.userName,userImg:props.userImg,userEmail:props.userEmail, userFlag: props.userFlag}});

    
  }

  return (
    <Box sx={{ display: 'flex' }} className="Drawer">
      <CssBaseline />
      <AppBar 
        position="fixed"
        sx={{ width: ` ${drawerWidth}%`, ml: `${drawerWidth}%` }}
      >
        
      </AppBar>
      <Drawer 
        sx={{
          width: `${drawerWidth}%`,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: `${drawerWidth}%`,
            boxSizing: 'border-box',
            backgroundColor:'#4d5bf9',
            borderTopRightRadius:'20px',
            borderBottomRightRadius:'20px',

            color:'#fff',

            
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        {console.log(props.userImg)}
        {console.log(props.userEmail)}
        
        <span className="userImgContainer"><img className='userImage' src={props.userImg}></img></span> 
     
        
        <span className='userInfo'>Welcome {props.userName}</span>
         <span className='userInfo'>{props.userEmail}</span>
     

       
        <Divider />
        {props.userFlag==1 ? (
        <ul className='ulSideBar'>

          
        <li onClick={toDashboard} className='liSideBar'>
          <span className='iconSideBar'><FaHome/></span>
          <span className='titleSideBar'>Dashboard</span>
          </li> 
          
          <li onClick={toManageUser} className='liSideBar'>
          <span className='iconSideBar'><FaUsersCog/></span>

          <span className='titleSideBar'>Manage Users</span>
          </li>

          
          


          <li onClick={logout} className='liSideBar'>
          <span className='iconSideBar'><FaUserMinus/></span>
          
          <GoogleLogout  
        clientId={clientId} 
        render={(renderProps) => (
          <span
            className='titleSideBar'
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            Logout
          </span>
        )}
        buttonText="Sign Out"
        onLogoutSuccess={onSignoutSuccess}
      ></GoogleLogout>


          </li>
       
       
      </ul>
      ) : (
        <ul className='ulSideBar'>

          
          <li onClick={toDashboard} className='liSideBar'>
            <span className='iconSideBar'><FaHome/></span>
            <span className='titleSideBar'>Dashboard</span>
            </li> 
            
           

            
            

 
            <li onClick={logout} className='liSideBar'>
            <span className='iconSideBar'><FaUserMinus/></span>
            
            <GoogleLogout  
          clientId={clientId} 
          render={(renderProps) => (
            <span
              className='titleSideBar'
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Logout
            </span>
          )}
          buttonText="Sign Out"
          onLogoutSuccess={onSignoutSuccess}
        ></GoogleLogout>

 
            </li>
         
         
        </ul>
      )}
        
        <Divider />
      </Drawer>
    </Box>
  );
}
