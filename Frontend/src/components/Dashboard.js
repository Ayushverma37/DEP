import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ProjectTable from './ProjectsTable'
import NavbarComp from './NavbarComp'
import PermanentDrawerLeft from './sidebar'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';

export default function Dashboard() {
 
  const {state} = useLocation();
  const [tableShow,setTableShow] = useState(false);
  const [all_projects,setall_projects] = useState(null);
  console.log(state.userImg);
  console.log("HELPL");
  console.log(state.userName);
  console.log(state.userEmail);
  console.log("SWEMZ",state.isDashboard);


  let obj={
    userName:state.userName,
    userEmail:state.userEmail,
    userImg:state.userImg,
    isDashboard:state.isDashboard,
  }

  
  async function add_proj_on_click(){

  

  return;
  }

  async function fetch_proj_on_click(){
    setTableShow(true);
    return;
    var server_address = "http://localhost:5000/user/" + obj.userEmail;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      
    });
    const response = await resp.json();
    console.log("Server response" , response);
    if(response!=1)
    {
      alert("You Are not an Admin , access Denied ");
      return;
    }

    var server_address = "http://localhost:5000/project/";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({sort:1})
    });

    const json_response= await resp2.json();

    setall_projects(json_response);
    setTableShow(true);

  }

  console.log("isDASHBOARD",obj.isDashboard)

  return (
    <div>
        <NavbarComp />
      
        <Stack justifyContent="center" alignItems="center" direction="row" spacing={3} padding={4}>
          <Box>
          <TextField id="standard-basic" label="Search Project" variant="standard" />
          <Button color="primary" size="large"   startIcon={<SearchIcon />}></Button>
          </Box>
          

          
            <Button variant="contained"
            onClick={
              fetch_proj_on_click
            }>Fetch All Projects </Button>
            <Button variant="contained"
            onClick={
              add_proj_on_click
            }>Add new project </Button>
          </Stack>
          {tableShow ? <ProjectTable data={all_projects} /> : null}
      
            
          
        <PermanentDrawerLeft {...obj}>
          </PermanentDrawerLeft>
    </div>
  )
}
