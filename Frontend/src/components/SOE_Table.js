import React, { useState,useEffect } from 'react'
// import data from "./data.json"
import soeData from "./soeData.json"
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';

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

export default function SOE_Table(props) {

  // useEffect(() => {
  //   // Update the document title using the browser API
  //   set_rows(props.data);
  // },[props.data]);

  // const [rows,set_rows] = useState(props.data);
  const [rows,set_rows]=useState(soeData);
  
  console.log(rows);
  return (
    <div className="soeTable">
        <TableContainer component={Paper} >
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                <StyledTableCell>Sr. No.</StyledTableCell>
                <StyledTableCell align="right">Particulars</StyledTableCell>
                <StyledTableCell align="right">Remarks</StyledTableCell>
                <StyledTableCell align="right">Voucher No. & Date</StyledTableCell>
                <StyledTableCell align="right">Receipt</StyledTableCell>
                <StyledTableCell align="right">Payment</StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
                <StyledTableCell align ="right">Heads</StyledTableCell>
                <StyledTableCell align ="right">Comment</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => (
                 <StyledTableRow key={row.sr}>
                 <StyledTableCell component="th" scope="row">
                     {row.sr}
                </StyledTableCell>
                <StyledTableCell align="right">{row.particulars}</StyledTableCell>
                <StyledTableCell align="right">{row.remarks}</StyledTableCell>
                <StyledTableCell align="right">{row.vouchNo}</StyledTableCell>
                <StyledTableCell align="right">{row.rec}</StyledTableCell>
                <StyledTableCell align="right">{row.pay}</StyledTableCell>
                <StyledTableCell align="right">{row.balance}</StyledTableCell>
                <StyledTableCell align="right">{row.heads}</StyledTableCell>
                <StyledTableCell align="right">
                  <Stack  direction="row"  spacing={-5}>
                  <Button startIcon={<RemoveRedEyeIcon />}/>
                <Button  style={{ width : '60px'}} startIcon={<AddIcon  />}/>

                    </Stack>
                </StyledTableCell>
              
                </StyledTableRow>
            ))}
            </TableBody>
        </Table>
        
        
        </TableContainer>
    </div>
  );
}


// <Table sx={{ minWidth: 700 }} aria-label="customized table">
//             <TableHead>
//             <TableRow>
//                 <StyledTableCell>Sr. No.</StyledTableCell>
//                 <StyledTableCell align="right">Heads</StyledTableCell>
//                 <StyledTableCell align="right">Sanctioned Amount</StyledTableCell>
//                 <StyledTableCell align="right">Fund Received 1st year</StyledTableCell>
//                 <StyledTableCell align="right">Fund Received 2nd year</StyledTableCell>
//                 <StyledTableCell align="right">Fund Received 3rd year</StyledTableCell>
//                 <StyledTableCell align="right">Expenditure</StyledTableCell>
//                 <StyledTableCell align ="right">Balance</StyledTableCell>
//             </TableRow>
//             </TableHead>
//             {/* <TableBody>
//             {rows.map((row) => (
//                 <StyledTableRow key={row.project_id}>
//                 <StyledTableCell component="th" scope="row">
//                     {row.project_id}
//                 </StyledTableCell>
//                 <StyledTableCell align="right">{row.project_title}</StyledTableCell>
//                 <StyledTableCell align="right">{row.professor_list}</StyledTableCell>
//                 <StyledTableCell align="right">{row.project_grant}</StyledTableCell>
//                 <StyledTableCell align="right">{row.comment_time}</StyledTableCell>
//                 </StyledTableRow>
//             ))}
//             </TableBody> */}
//         </Table>