
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
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import DeleteIcon from '@mui/icons-material/Delete';

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
      <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-primary mb-3"
          table="tbl1"
          filename="Project List"
          sheet="Sheet1"
          buttonText="Export Project List Table to Excel Sheet"
        />
        <TableContainer component={Paper}>
        <Table
            sx={{ minWidth: 900 }}
            aria-label="customized table"
            className="table"
            id="tbl1">
            <TableHead>
            <TableRow>
                
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>PI</StyledTableCell>
                <StyledTableCell>Co-PI</StyledTableCell>
                <StyledTableCell>Dept</StyledTableCell>
                <StyledTableCell>Funding Agency</StyledTableCell>
                <StyledTableCell >Title</StyledTableCell>
                <StyledTableCell>Sanctioned order no.</StyledTableCell>
                <StyledTableCell >Sanctioned date</StyledTableCell>
                <StyledTableCell >Total Project Cost</StyledTableCell>
                <StyledTableCell >Duration</StyledTableCell>
                <StyledTableCell >Year Sanctioned</StyledTableCell>
                <StyledTableCell >DOS</StyledTableCell>
                <StyledTableCell >DOC</StyledTableCell>
                <StyledTableCell >View Project</StyledTableCell>
                {props.userFlag===1?(<StyledTableCell >Delete Project</StyledTableCell>):(null)}
                

            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <StyledTableRow key={row.project_id} >
                <StyledTableCell component="th" scope="row" align="center">
                    {(row.project_id).toString().substring(1)}
                </StyledTableCell>
                <StyledTableCell align="center">{row.pi}</StyledTableCell>
                <StyledTableCell align="center">{row.co_pi}</StyledTableCell>
                <StyledTableCell align="center">{row.dept}</StyledTableCell>
                <StyledTableCell align="center">{row.fund_agency}</StyledTableCell>
                <StyledTableCell align="center">{row.project_title}</StyledTableCell>
                <StyledTableCell align="center">{row.sanc_order_no}</StyledTableCell>
                <StyledTableCell align="center">{row.sanctioned_date}</StyledTableCell>
                <StyledTableCell align="center">{row.project_grant}</StyledTableCell>
                <StyledTableCell align="center">{row.duration}</StyledTableCell>
                <StyledTableCell align="center">{row.start_year}</StyledTableCell>
                <StyledTableCell align="center">{row.dos}</StyledTableCell>
                <StyledTableCell align="center">{row.doc}</StyledTableCell>
                <StyledTableCell align="center"><Button onClick={async() => {

                  var server_address = "http://localhost:5000/get_main_table";
                  const resp2 = await fetch(server_address, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: row.project_id }),
                  });

                  const json_response = await resp2.json();
                  
                  server_address = "http://localhost:5000/get_summary_table";
                  const resp3 = await fetch(server_address, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: row.project_id }),
                  });

                  const json_response2 = await resp3.json();


                navigate("/soe", { state: { userName:props.userName,userImg:props.userImg,userEmail:props.userEmail, projId: row.project_id , project_title: row.project_title, projProfName: row.pi, project_grant: row.project_grant, table_data : json_response,summary_table_data : json_response2, userFlag: props.userFlag}});
                
              }}  startIcon={<ArrowCircleRightIcon />} /></StyledTableCell>
              {props.userFlag===2 ?(null):(<StyledTableCell>
                <Button
                      startIcon={<DeleteIcon />}
                      onClick={async() => {
                        if (
                          window.confirm("Are you sure, you want to delete")
                        )
                        {
                          var server_address =
                            "http://localhost:5000/del_project";
                          const resp2 = await fetch(server_address, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              p_id: row.project_id,
                              professors: row.professor_list,

                            }),
                          });
                          const json_response = await resp2.json();

                          var server_address2 = "http://localhost:5000/project/";
                          const resp3 = await fetch(server_address2, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sort: 1 }),
                          });

                          const json_response2 = await resp3.json();

                          set_rows(json_response2);
                          // setTableShow(true);
                        }
                        
                      }}
                    /></StyledTableCell>)}
              
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
