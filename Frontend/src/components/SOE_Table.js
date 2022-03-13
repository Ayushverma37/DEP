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
import AddExpensesRowPopUp from "./AddExpensesRowPop";

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
  useEffect(() => {
    // Update the document title using the browser API
    set_rows(props.table_data);
  }, [props.table_data]);

  // const [rows,set_rows] = useState(props.data);
  const [rows, set_rows] = useState(props.table_data);
  console.log("Project id = " + props.projId)
  console.log(rows);
  const [comment, setComment] = useState("");
  const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false);
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [rowId, setrowId] = useState(0);
  const [rowIdView, setrowIdView] = useState(0);
  const [commentJsonData, setcommentJsonData] = useState(CommentViewData);
  const [AddExpensesRowPop, setAddExpensesRowPop] = useState(false);
  const [new_sr,set_new_sr] = useState("");
  const [new_particulars,set_new_particulars]=useState("");
  const [new_remarks,set_new_remarks]=useState("")
  const [new_vouchno,set_new_vouchno]=useState("")
  const [new_rec,set_new_rec] = useState("");
  const [new_pay,set_new_pay]=useState("")
  const [new_balance,set_new_balance]=useState("")
  const [new_heads,set_new_heads]=useState("")

  const handleSubmit = async () => {
    console.log(comment);
    console.log(rowId);

    var server_address = "http://localhost:5000/comment";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: props.projId,
        row_no: rowId,
        comment_body: comment,
        prof_email: props.userEmail
      }),
    });

    const json_response = await resp2.json();
    console.log(json_response)

    setOpenAddCommentPopup(false);
  };

  const addNewExpensesRecord=async () =>{
    

    var server_address2 = "http://localhost:5000/user/" + props.userEmail;
    const resp = await fetch(server_address2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);
    
    if(response!=1){
      alert("YOU ARE NOT THE ADMIN");
      return
    }

    



    var server_address = "http://localhost:5000/insert_main_table";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 

       particulars: new_particulars,
       remarks : new_remarks,
       vouchno : new_vouchno,
       rec: new_rec,
       pay: new_pay,
       balance: new_balance,
       heads: new_heads,
       project_id : props.projId
        
       }),
    });
    
    const json_response = await resp2.json();
    console.log("RESPONSEEE->"+json_response);

  }

  useEffect(() => {
    if (rowIdView > 0) {
      console.log(rowIdView);
      setOpenViewCommentPopup(true);
      //Todo: Set the Json data according to "rowIdView"
    }
    else {
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
                  <StyledTableCell align="right">{row.vouchno}</StyledTableCell>
                  <StyledTableCell align="right">{row.rec}</StyledTableCell>
                  <StyledTableCell align="right">{row.pay}</StyledTableCell>
                  <StyledTableCell align="right">{row.balance}</StyledTableCell>
                  <StyledTableCell align="right">{row.heads}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={async () => {
                        setrowIdView(row.sr);
                        var server_address = "http://localhost:5000/get_comment";
                        const resp2 = await fetch(server_address, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            row_no: row.sr,
                            project_id: props.projId
                          }),
                        });

                        const json_response = await resp2.json();
                        console.log(json_response)
                        setcommentJsonData(json_response)
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
                    <StyledTableCell>Author</StyledTableCell>
                    <StyledTableCell align="right">Comment</StyledTableCell>
                    <StyledTableCell align="right">
                      Comment Date/Time
                    </StyledTableCell>
                    <StyledTableCell align="right">Resolved</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commentJsonData.map((row) => (
                    <StyledTableRow key={row.comment_time}>
                      <StyledTableCell component="th" scope="row">
                        {row.person}
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
      <Stack
        justifyContent="center"
        alignItems="center"
        direction="row"
        spacing={3}
        padding={4}
      >
        <Button
          variant="contained"
          onClick={async () => {
            var server_address2 = "http://localhost:5000/user/" + props.userEmail;
            const resp = await fetch(server_address2, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            });
            const response = await resp.json();
            console.log("Server response", response);

            if (response != 1) {
              alert("YOU ARE NOT THE ADMIN");
              return
            }
            setAddExpensesRowPop(true);
          }}
        >
          Add new expense
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            var server_address = "http://localhost:5000/get_main_table";
            const resp2 = await fetch(server_address, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ project_id: props.projId }),
            });

            const json_response = await resp2.json();
            set_rows(json_response);
          }}
        >
          REFRESH TABLE
        </Button>
      </Stack>

      <AddExpensesRowPopUp
        AddExpensesRowPop={AddExpensesRowPop}
        setAddExpensesRowPop={setAddExpensesRowPop}
      >
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": {  width: "600px" } }}
          
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="addExpenses">
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
     style = {{width: 500}}

                id="outlined-basic"
                label="Particulars"
                variant="outlined"
                onChange={(event) => {
                  set_new_particulars(event.target.value);
                }}
              />
              <TextField
     style = {{width: 500}}

                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                onChange={(event) => {
                  set_new_remarks(event.target.value)
                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
     style = {{width: 500}}

                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                     style = {{width: 500}}
                id="outlined-basic" label="Rec" variant="outlined" 
                onChange={(event) => {
                  set_new_rec(event.target.value);
                }}/>
              <TextField
                     style = {{width: 500}}
                id="outlined-basic" label="Pay" variant="outlined" 
                onChange={(event) => {
                  set_new_pay(event.target.value);
                }}/>
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
     style = {{width: 500}}

                id="outlined-basic"
                label="Balance"
                variant="outlined"
                onChange={(event) => {
                  set_new_balance(event.target.value);
                }}
              />
              <TextField
                     style = {{width: 500}}
                id="outlined-basic" label="Heads" variant="outlined" 
                onChange={(event) => {
                  set_new_heads(event.target.value);
                }}
                />
            </Stack>
            <center>
              <Button
                onClick={() => {
                  addNewExpensesRecord();
                  setAddExpensesRowPop(false);
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Add
              </Button>
            </center>
          </div>
        </Box>
      </AddExpensesRowPopUp>
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
