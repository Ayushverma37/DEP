import React, { useState, useEffect } from "react";
// import data from "./data.json"
import soeData from "./soeData.json";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import AddCommentPopup from "./AddCommentPopup";
import ViewCommentPopup from "./ViewCommentPopup";
import CommentViewData from "./CommentViewData.json";

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

export default function SOE_Table(props) {
  // useEffect(() => {
  //   // Update the document title using the browser API
  //   set_rows(props.data);
  // },[props.data]);

  // const [rows,set_rows] = useState(props.data);
  const [rows, set_rows] = useState(soeData);

  console.log(rows);
  const [comment, setComment] = useState("");
  const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false);
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [rowId, setrowId] = useState(0);
  const [rowIdView, setrowIdView] = useState(0);
  const [commentJsonData, setcommentJsonData] = useState(CommentViewData);

  const handleSubmit = () => {
    console.log(comment);
    console.log(rowId);
    setOpenAddCommentPopup(false);
  };

  useEffect(() => {
    if (rowIdView > 0) {
      console.log(rowIdView);
      setOpenViewCommentPopup(true);
      //Todo: Set the Json data according to "rowIdView"
    }
    else{
      setOpenViewCommentPopup(false);
    }
  }, [rowIdView]);

  return (
    <>
      <div className="soeTable">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Sr. No.</StyledTableCell>
                <StyledTableCell align="right">Particulars</StyledTableCell>
                <StyledTableCell align="right">Remarks</StyledTableCell>
                <StyledTableCell align="right">
                  Voucher No. & Date
                </StyledTableCell>
                <StyledTableCell align="right">Receipt</StyledTableCell>
                <StyledTableCell align="right">Payment</StyledTableCell>
                <StyledTableCell align="right">Balance</StyledTableCell>
                <StyledTableCell align="right">Heads</StyledTableCell>
                <StyledTableCell align="right">Comment</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.sr}>
                  <StyledTableCell component="th" scope="row">
                    {row.sr}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.particulars}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.remarks}</StyledTableCell>
                  <StyledTableCell align="right">{row.vouchNo}</StyledTableCell>
                  <StyledTableCell align="right">{row.rec}</StyledTableCell>
                  <StyledTableCell align="right">{row.pay}</StyledTableCell>
                  <StyledTableCell align="right">{row.balance}</StyledTableCell>
                  <StyledTableCell align="right">{row.heads}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={() => {
                        setrowIdView(row.sr);
                        // ViewComments(row.sr)
                      }}
                    />
                    <Button
                      style={{ width: "60px" }}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddCommentPopup(true);
                        setrowId(row.sr);
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <AddCommentPopup
        openAddCommentPopup={openAddCommentPopup}
        setOpenAddCommentPopup={setOpenAddCommentPopup}
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
          <div className="AddComment">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => setOpenAddCommentPopup(false)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Comment"
                multiline
                rows={4}
                defaultValue=""
                bgcolor="white"
                sx={{ zIndex: "tooltip" }}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                >
                  Send
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </AddCommentPopup>

      <ViewCommentPopup
        openViewCommentPopup={openViewCommentPopup}
        setOpenViewCommentPopup={setOpenViewCommentPopup}
      >
        <div className="viewCommentDiv">
          <span>
            <Button
              startIcon={<CloseIcon />}
              style={{ float: "right" }}
              onClick={() => {
                setOpenViewCommentPopup(false)
                setrowIdView(0)
              }}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ProfessorName</StyledTableCell>
                    <StyledTableCell align="right">Comment</StyledTableCell>
                    <StyledTableCell align="right">
                      Comment Date/Time
                    </StyledTableCell>
                    <StyledTableCell align="right">Resolved</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commentJsonData.map((row) => (
                    <StyledTableRow key={row.professorName}>
                      <StyledTableCell component="th" scope="row">
                        {row.professorName}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.comment}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.comment_time}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {row.resolved}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </span>
        </div>
      </ViewCommentPopup>
    </>
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
