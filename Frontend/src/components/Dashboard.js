import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProjectTable from "./ProjectsTable";
import NavbarComp from "./NavbarComp";
import PermanentDrawerLeft from "./sidebar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import AddProjectPopup from "./AddProjectPopup";

export default function Dashboard() {
  const { state } = useLocation();
  const [tableShow, setTableShow] = useState(false);
  const [all_projects, setall_projects] = useState(null);
  const [openAddProjectPopup, setopenAddProjectPopup] = useState(false)
  console.log(state.userImg);
  console.log("HELPL");
  console.log(state.userName);
  console.log(state.userEmail);
  console.log("SWEMZ", state.isDashboard);

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
    allProjectData: all_projects,
  };

  async function add_proj_on_click() {
    setopenAddProjectPopup(true);
    return;
  }

  async function fetch_proj_on_click() {
    setTableShow(true);
    console.log("Fetched");
    return;
    var server_address = "http://localhost:5000/user/" + obj.userEmail;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);
    if (response != 1) {
      alert("You Are not an Admin , access Denied ");
      return;
    }

    var server_address = "http://localhost:5000/project/";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sort: 1 }),
    });

    const json_response = await resp2.json();

    setall_projects(json_response);
    setTableShow(true);
  }

  console.log("isDASHBOARD", obj.isDashboard);

  return (
    <div>
      <NavbarComp />

      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        spacing={3}
        padding={4}
      >
        <Box>
          <TextField
            id="standard-basic"
            label="Search Project"
            variant="standard"
          />
          <Button
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
          ></Button>
        </Box>

        <Button variant="contained" onClick={fetch_proj_on_click}>
          Fetch All Projects{" "}
        </Button>
        <Button variant="contained" onClick={add_proj_on_click}>
          Add new project{" "}
        </Button>
      </Stack>
      {tableShow ? <ProjectTable {...obj} /> : null}
      <AddProjectPopup openAddProjectPopup={openAddProjectPopup} setopenAddProjectPopup={setopenAddProjectPopup}>
        <Box component="form" sx={{ "& .MuiTextField-root": { m: 1, width: "500px" } }} noValidate autoComplete="off" display="flex" justifyContent="center" alignItems="center">
          <div className="AddProject">
            <TextField id="outlined-basic" label="Project Id" variant="outlined" />
            <TextField id="outlined-basic" label="Project Title" variant="outlined" />
            <TextField id="outlined-basic" label="Professor" variant="outlined" />
            <TextField id="outlined-basic" label="Grant" variant="outlined" />
            <TextField id="outlined-basic" label="Comments" variant="outlined" />
            <center>
              <Button variant="contained" endIcon={<SendIcon />}>
                Send
              </Button>
            </center>

          </div>
        </Box>
      </AddProjectPopup>


      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}
