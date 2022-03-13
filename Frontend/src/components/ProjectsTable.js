
import React, { useState,useEffect } from 'react'
import data from "./data.json"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProjectTable(props) {
  const navigate=useNavigate();

   useEffect(() => {
     // Update the document title using the browser API
     set_rows(props.allProjectData);
   },[props.allProjectData]);

  const [projectId, setprojectId] = useState(0)
  const [rows,set_rows] = useState(data);
  console.log("Hello " +props)
  console.log(rows);
  function sortByID(){

  }
  function sortByTitle(){
    
  }
  function sortByProfessor(){
    
  }
  function sortByGrant(){
    
  }
  function sortByCommentTime(){
    
  }
  
  return (
    <div className="tableContainer">
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                
                <StyledTableCell><Button style={{color:"white"}} onClick={sortByID}>ID</Button></StyledTableCell>
                <StyledTableCell align="center"><Button style={{color:"white"}} onClick={sortByTitle}>title</Button></StyledTableCell>
                <StyledTableCell align="center"><Button style={{color:"white"}} onClick={sortByProfessor}>Professor</Button></StyledTableCell>
                <StyledTableCell align="center"><Button style={{color:"white"}} onClick={sortByGrant}>Grant</Button></StyledTableCell>
                <StyledTableCell align="center"><Button style={{color:"white"}} onClick={sortByCommentTime}>Comment Time</Button></StyledTableCell>
                <StyledTableCell align="center">View Project</StyledTableCell>

            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <StyledTableRow key={row.project_id} >
                <StyledTableCell component="th" scope="row" align="center">
                    {row.project_id}
                </StyledTableCell>
                <StyledTableCell align="center">{row.project_title}</StyledTableCell>
                <StyledTableCell align="center">{row.professor_list}</StyledTableCell>
                <StyledTableCell align="center">{row.project_grant}</StyledTableCell>
                <StyledTableCell align="center">{row.comment_time}</StyledTableCell>
                <StyledTableCell align="center"><Button onClick={async() => {

                  var server_address = "http://localhost:5000/get_main_table";
                  const resp2 = await fetch(server_address, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: row.project_id }),
                  });

                  const json_response = await resp2.json();

                navigate("/soe", { state: { userName:props.userName,userImg:props.userImg,userEmail:props.userEmail, projId: row.project_id , table_data : json_response}});
                
              }}  startIcon={<ArrowCircleRightIcon />} /></StyledTableCell>
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
