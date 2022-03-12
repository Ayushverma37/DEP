import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
  const [currentUserEmail, sercurrentUserEmail] = useState("");

  let obj = {
    userName: state.userName,
    userEmail: state.userEmail,
    userImg: state.userImg,
    isDashboard: state.isDashboard,
  };

  const [openRemoveUserPop, setOpenRemoveUserPop] = useState(false);

  async function add_user_on_click() {
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
  }

  function removeUser() {
    //To DO; //Curreent user email is stored in currentUserEmail handled by useState
  }
  return (
    <div>
      <NavbarComp />

      <RemoveUserPop 
        className="removeUserClass"
        openRemoveUserPop={openRemoveUserPop}
        setOpenRemoveUserPop={setOpenRemoveUserPop}
      >
        <div className="removeUserDiv">
          <span>
            <div> Are you sure you want to remove the user ? </div>
            <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={removeUser}
                >
                  YES
                </Button>
          </span>
        </div>
      </RemoveUserPop>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>

                <StyledTableCell align="right">Role</StyledTableCell>

                <StyledTableCell align="right">Remove</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow
                  key={row.project_id}
                  onClick={() => {
                    setOpenRemoveUserPop(true);
                    sercurrentUserEmail(row.Email);
                  }}
                >
                  <StyledTableCell component="th" scope="row">
                    {row.project_id}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.Email}</StyledTableCell>
                  {row.Role ? (
                    <StyledTableCell align="right">Admin</StyledTableCell>
                  ) : (
                    <StyledTableCell align="right">Professor</StyledTableCell>
                  )}
                  <StyledTableCell align="right">
                    <Button startIcon={<RemoveCircleOutlineIcon />} />
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
