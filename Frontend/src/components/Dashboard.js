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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";


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
  const [searchOption, setsearchOption] = useState("")
  const [newPI, setnewPI] = useState("")
  const [newCOPI, setnewCOPI] = useState("")
  const [newDepartment, setnewDepartment] = useState("")
  const [newAgency, setnewAgency] = useState("")
  const [newSanctionedNumber, setnewSanctionedNumber] = useState("")
  const [newSanctionedDate, setnewSanctionedDate] = useState("")
  const [newDOC, setnewDOC] = useState("")
  const [newDOS, setnewDOS] = useState("")
  const [newYear, setnewYear] = useState("")
  const [newDuration, setnewDuration] = useState("")

  console.log(state.userImg);
  console.log("HELPL");
  console.log(state.userName);
  console.log(state.userEmail);
  console.log("SWEMZ", state.isDashboard);

  const SubmitAddProject = async () => {
    if((new Date(newDOS).getTime())>(new Date(newDOC).getTime())){
      alert("Start Date is later than Completion Date");
      return;
    }
    else if((new Date(newDOS).getFullYear())!=newYear)
    {
      alert("Year in Start Date does not match with Start year entered");
      return;
    }
    // console.log(new Date(newDOS).getTime());
    var server_address = "http://localhost:5000/create_project";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: "p"+newProjectId,
        project_title: newProjectTitle,
        professors: newProfessor,
        grant: newGrant,
        pi: newPI,
        co_pi: newCOPI,
        dept: newDepartment,
        fund_agency: newAgency,
        sanc_order_no: newSanctionedNumber,
        sanctioned_date: newSanctionedDate,
        duration: newDuration,
        dos: newDOS,
        doc:newDOC,
        start_year: newYear,
        rec_sanctioned_amount: newRecurring,
        nonrec_sanctioned_amount: newNonRecurring,
        man_sanc: newManpower,
        cons_sanc: newConsumables,
        travel_sanc: newTravel,
        testing_sanc: newDemo,
        overhead_sanc: newOverheads,
        unforseen_sanc: newUnforeseenExpenses,
        equip_sanc: newEquipment,
        const_sanc: newConstruction,
        fab_sanc: newFabrication


      }),
    });

    const json_response = await resp2.json();
    if(json_response==-1){
      alert("Total project cost is not equal to the sum of recurring and non recurring");
      return;
    }
    else if(json_response==-2){
      alert("Either recurring or non recurring total is less than sum of corresponding subheads");
      return;
    }
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
    userFlag: state.userFlag,
  };

  async function add_proj_on_click() {
    setnewProjectId("")
    setnewProjectTitle("")
    setnewProfessor("")
    setnewGrant("")
    setnewManpower("")
    setnewConsumables("")
    setnewTravel("")
    setnewDemo("")
    setnewOverheads("")
    setnewUnforeseenExpenses("")
    setnewEquipment("")
    setnewConstruction("")
    setnewFabrication("")
    setnewRecurring("")
    setnewNonRecurring("")
    setsearchOption("")
    setnewPI("")
    setnewCOPI("")
    setnewDepartment("")
    setnewAgency("")
    setnewSanctionedNumber("")
    setnewSanctionedDate("")
    setnewDOC("")
    setnewDOS("")
    setnewYear("")
    setnewDuration("")
    // var server_address = "http://localhost:5000/user/" + obj.userEmail;
    // const resp = await fetch(server_address, {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    // const response = await resp.json();
    // console.log("Server response", response);

    // if(response!=1){
    //   alert("YOU ARE NOT THE ADMIN")
    //   return
    // }

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

    
    var server_address = "http://localhost:5000/project_search";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin: state.userFlag,
        type: searchOption,
        title: searchProject,
        id:"p"+searchProject,
        pi: searchProject,
        dept: searchProject,
        year: searchProject,
        fund_agency:searchProject,
        email_id: state.userEmail,
      }),
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
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Search By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={searchOption}
              label="Age"
              onChange={(event) => {
                setsearchOption(event.target.value);
              }}
            >
              <MenuItem value={"2"}>ID</MenuItem>
              <MenuItem value={"1"}>Title</MenuItem>
              <MenuItem value={"3"}>Name of PI</MenuItem>
              <MenuItem value={"4"}>Department</MenuItem>
              <MenuItem value={"5"}>Year</MenuItem>
              <MenuItem value={"6"}>Funding Agency</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={search_project}>
            Search{" "}
          </Button>
          {/* <Button variant="contained" onClick={search_project_prof}>
            Search by Professor{" "}
          </Button> */}

          <Button variant="contained" onClick={fetch_proj_on_click}>
            Fetch All Projects{" "}
          </Button>
          {state.userFlag===1?(<Button variant="contained" onClick={add_proj_on_click}>
            Add new project{" "}
          </Button>):(null)}
          
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
              label="Email-id of collaborators"
              variant="outlined"
              onChange={(event) => {
                setnewProfessor(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Name of PI"
              variant="outlined"
              onChange={(event) => {
                setnewPI(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Name of Co-PI"
              variant="outlined"
              onChange={(event) => {
                setnewCOPI(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Department"
              variant="outlined"
              onChange={(event) => {
                setnewDepartment(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Funding Agency"
              variant="outlined"
              onChange={(event) => {
                setnewAgency(event.target.value);
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
              label="Sanctioned order number"
              variant="outlined"
              onChange={(event) => {
                setnewSanctionedNumber(event.target.value);
              }}
            />
            <TextField
              type="date"
              id="outlined-basic"
              label="Sanctioned Date"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setnewSanctionedDate(event.target.value);
              }}
            />
            <TextField
              type="number"
              id="outlined-basic"
              label="Total Project Cost"
              variant="outlined"
              onChange={(event) => {
                setnewGrant(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Duration"
              variant="outlined"
              
              onChange={(event) => {
                setnewDuration(event.target.value);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Start Year"
              variant="outlined"
              
              onChange={(event) => {
                setnewYear(event.target.value);
              }}
            />
            <TextField 
              type="date"
              id="outlined-basic"
              label="Date of Start"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setnewDOS(event.target.value);
              }}
            />
            <TextField
              type="date"
              id="outlined-basic"
              label="Date of Completion"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => {
                setnewDOC(event.target.value);
              }}
            />
            <center>
              Enter the Sanctioned Amount under the following categories:-{" "}
            </center>
            <TextField
              type="number"
              id="outlined-basic"
              label="Recurring"
              variant="outlined"
              onChange={(event) => {
                setnewRecurring(event.target.value);
              }}
            />
            <TextField
              type="number"
              id="outlined-basic"
              label="Non-recurring"
              variant="outlined"
              onChange={(event) => {
                setnewNonRecurring(event.target.value);
              }}
            />
            <Stack justifyContent="center" alignItems="center"  direction="row" >
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
            <TextField type = "number" id="outlined-basic" label="Fabrication" variant="outlined"
              onChange={(event) => {
                setnewFabrication(event.target.value);
              }}
            />
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
            

            <center>
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={SubmitAddProject}
              >
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