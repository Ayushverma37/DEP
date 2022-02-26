import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import CustomizedTables from './Dashboard2'
import NavbarComp from './NavbarComp'
import PermanentDrawerLeft from './sidebar_final'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';


export default function DashboardFinal() {
  useEffect(() => {
    return () => {
    }
  }, []);
  const {state} = useLocation();
  const [tableShow,setTableShow] = useState(false);
  console.log(state.userImg);
  console.log("HELPL");
  console.log(state.userName);
  console.log(state.userEmail);

  let obj={
    userName:state.userName,
    userEmail:state.userEmail,
    userImg:state.userImg,
  }
  return (
    <div>
        <NavbarComp />
          <Stack justifyContent="center" alignItems="center" direction="row" spacing={0} padding={4}>
          <TextField id="standard-basic" label="Search Project" variant="standard" />
          <Button color="primary" size="large"   startIcon={<SearchIcon />}>

          </Button>
            <Button variant="contained"
            onClick={() => {
            setTableShow(true);
          }}>Fetch All Projects </Button>
          </Stack>
          {tableShow ? <CustomizedTables/> : null}

        {/* <CustomizedTables /> */}
        {/* <center>{state.emailid}</center> */}
        {/* <PermanentDrawerLeft/> */}

        <PermanentDrawerLeft {...obj}>
          </PermanentDrawerLeft>
    </div>
  )
}
