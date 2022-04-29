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
  const [newManpower, setnewManpower] = useState("")
  const [newConsumables, setnewConsumables] = useState("")
  const [newTravel, setnewTravel] = useState("")
  const [newDemo, setnewDemo] = useState("")
  const [newOverheads, setnewOverheads] = useState("")
  const [newUnforeseenExpenses, setnewUnforeseenExpenses] = useState("")
  const [newEquipment, setnewEquipment] = useState("")
  const [newConstruction, setnewConstruction] = useState("")
  const [newFabrication, setnewFabrication] = useState("")
  const [newRecurring, setnewRecurring] = useState("")
  const [newNonRecurring, setnewNonRecurring] = useState("")

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
        grant: newGrant,
        manpower:newManpower,
        consumables:newConsumables,
        travel:newTravel,
        field:newDemo,
        overheads:newOverheads,
        unforseen:newUnforeseenExpenses,
        equipments:newEquipment,
        construction:newConstruction,
        fabrication:newFabrication
      }),
    });

    const json_response = await resp2.json();
    console.log("RESPONSEEE->" + json_response);
    console.log(newProjectTitle);
    setopenAddProjectPopup(false);
    fetch_proj_on_click();
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

  async function search_project_prof() {

    
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
      <div className="searchDiv">

      
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
            label="Search"
            variant="standard"
            onChange={(event) => {
              setsearchProject(event.target.value);
            }}
          />
          {/* <Button
            onClick={search_project}
            color="primary"
            size="large"
            startIcon={<SearchIcon />}
          ></Button> */}
        </Box>
        <Button variant="contained" onClick={search_project}>
          Search by Title{" "}
        </Button>
        <Button variant="contained" onClick={search_project_prof}>
        Search by Professor{" "}
        </Button>

        <Button variant="contained" onClick={fetch_proj_on_click}>
          Fetch All Projects{" "}
        </Button>
        <Button variant="contained" onClick={add_proj_on_click}>
          Add new project{" "}
        </Button>
      </Stack>
      </div>
      {tableShow ? <ProjectTable {...obj} /> : null}
      <AddProjectPopup
        openAddProjectPopup={openAddProjectPopup}
        setopenAddProjectPopup={setopenAddProjectPopup}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "500px" } }}
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
            <TextField type="number" id="outlined-basic" label="Grant" variant="outlined"
              onChange={(event) => {
                setnewGrant(event.target.value);
              }}
            />
            <center>Enter the Sanctioned Amount under the following categories:- </center>
            <TextField type="number" id="outlined-basic" label="Recurring" variant="outlined"
              onChange={(event) => {
                setnewRecurring(event.target.value);
              }}
            />
            <TextField type="number" id="outlined-basic" label="Non-recurring" variant="outlined"
              onChange={(event) => {
                setnewNonRecurring(event.target.value);
              }}
            />
            {/* <Stack justifyContent="center" alignItems="center"  direction="row" >
            <TextField type="number" style = {{width: 500}} id="outlined-basic" label="Manpower" variant="outlined" 
              onChange={(event) => {
                setnewManpower(event.target.value);
              }}
            />
            <TextField type="number" style = {{width: 500}}  id="outlined-basic" label="Consumables" variant="outlined"
              onChange={(event) => {
                setnewConsumables(event.target.value);
              }}
            />
            </Stack>
            <Stack justifyContent="center" alignItems="center"  direction="row">
            <TextField type = "number" id="outlined-basic" label="Travel" variant="outlined"
              onChange={(event) => {
                setnewTravel(event.target.value);
              }}
            />
            <TextField type = "number" id="outlined-basic" label="Field Testing/Demo/Tranings" variant="outlined"
              onChange={(event) => {
                setnewDemo(event.target.value);
              }}
            />
            </Stack>
            <Stack justifyContent="center" alignItems="center"  direction="row">
            <TextField type = "number" id="outlined-basic" label="Overhead" variant="outlined"
              onChange={(event) => {
                setnewOverheads(event.target.value);
              }}
            />
            <TextField type = "number" id="outlined-basic" label="Unforseen Expenses" variant="outlined"
              onChange={(event) => {
                setnewUnforeseenExpenses(event.target.value);
              }}
            />
            </Stack>
            <Stack justifyContent="center" alignItems="center"  direction="row">
            <TextField type = "number" id="outlined-basic" label="Equipment" variant="outlined"
              onChange={(event) => {
                setnewEquipment(event.target.value);
              }}
            />
            <TextField type = "number" id="outlined-basic" label="Construction" variant="outlined"
              onChange={(event) => {
                setnewConstruction(event.target.value);
              }}
            />
            </Stack>
            <TextField type = "number" id="outlined-basic" label="Fabrication" variant="outlined"
              onChange={(event) => {
                setnewFabrication(event.target.value);
              }}
            /> */}
            
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