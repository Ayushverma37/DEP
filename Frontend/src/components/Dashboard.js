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
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard() {
  const { state } = useLocation();
  const [tableShow, setTableShow] = useState(false);
  const [all_projects, setall_projects] = useState(null);
  const [openAddProjectPopup, setopenAddProjectPopup] = useState(false);
  const [newProjectId, setnewProjectId] = useState("")
  const [newProjectTitle, setnewProjectTitle] = useState("")
  const [newProfessor, setnewProfessor] = useState("")
  const [newGrant, setnewGrant] = useState("")

  console.log(state.userImg);
  console.log("HELPL");
  console.log(state.userName);
  console.log(state.userEmail);
  console.log("SWEMZ", state.isDashboard);

  const SubmitAddProject = async () => {

    var server_address = "http://localhost:5000/create_project";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: newProjectId,
        project_title: newProjectTitle,
        professors: newProfessor,
        grant: newGrant
      }),
    });

    const json_response = await resp2.json();
    console.log("RESPONSEEE->" + json_response);
    console.log(newProjectTitle);
    setopenAddProjectPopup(false);
  };

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
    allProjectData: all_projects,
  };

  async function add_proj_on_click() {
    
    var server_address = "http://localhost:5000/user/" + obj.userEmail;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);

    if(response!=1){
      alert("YOU ARE NOT THE ADMIN")
      return
    }

    setopenAddProjectPopup(true);

    return;
  }

  async function fetch_proj_on_click() {
    /*setTableShow(true);
    console.log("Fetched");
    return;*/

    var server_address = "http://localhost:5000/user/" + obj.userEmail;
    const resp = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);
    if (response == 2) {

      var server_address2 = "http://localhost:5000/project_prof/" + obj.userEmail;
      const resp2 = await fetch(server_address2, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const response2 = await resp2.json();
      console.log("Server response", response2);
      
      setall_projects(response2);
      setTableShow(true);
      
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

  async function search_project() {

    
    var server_address = "http://localhost:5000/project/" + searchProject;
    const resp2 = await fetch(server_address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const json_response = await resp2.json();
    setall_projects(json_response);
    setTableShow(true);
    return;
    //TODO
    //We will use the setall_project state to update the JSON file with new data
  }

  const [searchProject, setsearchProject] = useState("");
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
            onChange={(event) => {
              setsearchProject(event.target.value);
            }}
          />
          <Button
            onClick={search_project}
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
      <AddProjectPopup
        openAddProjectPopup={openAddProjectPopup}
        setopenAddProjectPopup={setopenAddProjectPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "400px" } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="AddProject">
            <Button
              className="CloseAddProjectPopup"
              startIcon={<CloseIcon />}
              style={{ float: "right" }}
              onClick={() => {
                setopenAddProjectPopup(false);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Project Id"
              variant="outlined"
              onChange={(event) => {
                setnewProjectId(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Project Title"
              variant="outlined"
              onChange={(event) => {
                setnewProjectTitle(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Professors"
              variant="outlined"
              onChange={(event) => {
                setnewProfessor(event.target.value);
              }}
            />
            <TextField id="outlined-basic" label="Grant" variant="outlined"
              onChange={(event) => {
                setnewGrant(event.target.value);
              }}
            />
            <center>
              <Button variant="contained" endIcon={<SendIcon />} onClick={SubmitAddProject}>
                Add Project
              </Button>
            </center>
          </div>
        </Box>
      </AddProjectPopup>

      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}
