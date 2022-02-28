// import * as React from 'react';
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

  useEffect(() => {
    // Update the document title using the browser API
    set_rows(props.data);
  },[props.data]);

  const [rows,set_rows] = useState(props.data);
  
  console.log(rows);
  return (
    <div className="tableContainer">
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="right">Title</StyledTableCell>
                <StyledTableCell align="right">Professor</StyledTableCell>
                <StyledTableCell align="right">Grant</StyledTableCell>
                <StyledTableCell align="right">Comment</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                <StyledTableRow key={row.project_id}>
                <StyledTableCell component="th" scope="row">
                    {row.project_id}
                </StyledTableCell>
                <StyledTableCell align="right">{row.project_title}</StyledTableCell>
                <StyledTableCell align="right">{row.professor_list}</StyledTableCell>
                <StyledTableCell align="right">{row.project_grant}</StyledTableCell>
                <StyledTableCell align="right">{row.comment_time}</StyledTableCell>
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        </TableContainer>
    </div>
  );
}
