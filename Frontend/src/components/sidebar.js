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


const drawerWidth = 15;

export default function PermanentDrawerLeft(props) {
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
        <ul className='ulSideBar'>

          <li className='liSideBar'><a href="#">
            <span className='iconSideBar'><FaHome/></span>
            <span className='titleSideBar'>Dashboard</span>

            </a>
            </li>
            <li className='liSideBar'><a href="#">
            <span className='iconSideBar'><FaUsersCog/></span>
            <span className='titleSideBar'>Manage Users</span>

            </a>
            </li>
            <li className='liSideBar'><a href="#">
            <span className='iconSideBar'><FaUserMinus/></span>
            <span className='titleSideBar'>Log Out</span>

            </a>
            </li>
         
         
        </ul>
        <Divider />
      </Drawer>
    </Box>
  );
}
