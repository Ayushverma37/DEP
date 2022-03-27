import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Stack from "@mui/material/Stack";

import NavbarComp from "./NavbarComp";
import PermanentDrawerLeft from "./sidebar";
import Button from "@mui/material/Button";
import data from "./data.json";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ViewCommentPopup from "./ViewCommentPopup";
import RemoveUserPop from "./RemoveUserPop";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Manageuser() {
  const { state } = useLocation();

  const [rows, set_rows] = useState(data);
  const [currentUserEmail, setcurrentUserEmail] = useState("");
  const [newUserRole,setnewUserRole]=useState();
  const [newUserEmail,setnewUserEmail]=useState();
  const [newUsername, setnewUsername] = useState();


  useEffect(async () => {

    var server_address = "http://localhost:5000/get_user";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
       }),
    });

    const response = await resp2.json();
    console.log("Server response", response);
    set_rows(response);
    
  }, []);

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
  };

  const [openRemoveUserPop, setOpenRemoveUserPop] = useState(false);

  async function add_user_on_click() {
    /*
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
    }*/

    var server_address = "http://localhost:5000/user";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email_id : newUserEmail,
        name: newUsername,
        admin : newUserRole
       }),
    });

    const response = await resp2.json();
    console.log("Server response", response);
    set_rows(response);
    console.log("THis is rows ->"+rows);  
  }

  function removeUser() {
    //To DO; //Curreent user email is stored in currentUserEmail handled by useState
  }
  function addUser() {
    //To DO; //Curreent user email and role is stored in newUserEmail,newUserRole  handled by useState
  }
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
        <TextField
            id="standard-basic"
            label="Email Address"
            variant="standard"
            onChange={(event) => {
              setnewUserEmail(event.target.value);
            }}
          />
          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            onChange={(event) => {
              setnewUsername(event.target.value);
            }}
          />
          <TextField
            id="standard-basic"
            label="Role (Admin/Professor)"
            variant="standard"
            onChange={(event) => {
              setnewUserRole(event.target.value);
            }}
          />
        <Button variant="contained" onClick={add_user_on_click}>
          Add new user
        </Button>
      
      </Stack>


      <RemoveUserPop
        className="removeUserClass"
        openRemoveUserPop={openRemoveUserPop}
        setOpenRemoveUserPop={setOpenRemoveUserPop}
      >
        <div className="removeUserDiv">
          <span>
            <div> Are you sure you want to remove the user ? </div>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={4}
            >
              <Button
                style={{
                  height: "30px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
                variant="contained"
                onClick={() => {
                  removeUser();
                  setOpenRemoveUserPop(false);
                }}
              >
                YES
              </Button>
              <Button
                variant="contained"
                style={{
                  height: "30px",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                }}
                onClick={() => {
                  setOpenRemoveUserPop(false);
                }}
              >
                NO
              </Button>
            </Stack>
          </span>
        </div>
      </RemoveUserPop>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              

                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Name</StyledTableCell>
                

                <StyledTableCell align="center">Role</StyledTableCell>

                <StyledTableCell align="center">Remove</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow
                  key={row.email_id}
                  
                >
                 
                  <StyledTableCell align="center">{row.email_id}</StyledTableCell>
                  <StyledTableCell align="center">{row.user_name}</StyledTableCell>
                  {row.admin==1 ? (
                    <StyledTableCell align="center">Admin</StyledTableCell>
                  ) : (
                    <StyledTableCell align="center">Professor</StyledTableCell>
                  )}
                  <StyledTableCell align="center">
                    <Button 
                    onClick={() => {
                      setOpenRemoveUserPop(true);
                      setcurrentUserEmail(row.email_id);
                    }}
                    startIcon={<RemoveCircleOutlineIcon />} />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <PermanentDrawerLeft {...obj}></PermanentDrawerLeft>
    </div>
  );
}
