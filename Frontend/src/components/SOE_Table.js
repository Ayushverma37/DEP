import React, { useState, useEffect } from 'react';
// import data from "./data.json"
import soeData from './soeData.json';
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
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import AddCommentPopup from './AddCommentPopup';
import EditPopup from './EditPopup';
import ViewCommentPopup from './ViewCommentPopup';
import CommentViewData from './CommentViewData.json';
import CommitPopup from './CommitPopup';
import AddExpensesRowPopUp from './AddExpensesRowPop';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AddFundsPopUp from './AddFundsPopup';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { green } from '@mui/material/colors';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import ImportExcelPop from './ImportExcelPop';

import * as XLSX from 'xlsx';

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
    // backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const BACKEND_URL = `${process.env.REACT_APP_BACKEND_URL}`;
const GET_MAIN_TABLE_URL = `${BACKEND_URL}/get_main_table`;
const GET_SUMMARY_TABLE_URL = `${BACKEND_URL}/get_summary_table`;
const POST_INSERT_MAIN_TABLE_URL = `${BACKEND_URL}/insert_main_table`;

export default function SOE_Table(props) {
  useEffect(() => {
    // Update the document title using the browser API
    set_rows(props.table_data);
    setsummaryrows(props.summary_table_data);
  }, [props.table_data, props.summary_table_data]);

  // const [rows,set_rows] = useState(props.data);
  const [rows, set_rows] = useState(props.table_data);
  const [summaryrows, setsummaryrows] = useState(props.summary_table_data);
  const [comment, setComment] = useState('');
  const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [Edit, setEdit] = useState('');
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [openAddFundsPopUp, setOpenAddFundsPopUp] = useState(false);
  const [openCommitPopup, setOpenCommitPopup] = useState(false);
  const [rowId, setrowId] = useState(0);
  const [NewExpense, setNewExpense] = useState('');
  const [rowIdView, setrowIdView] = useState(0);
  const [commentJsonData, setcommentJsonData] = useState(CommentViewData);
  const [AddExpensesRowPop, setAddExpensesRowPop] = useState(false);
  const [new_sr, set_new_sr] = useState('');
  const [new_particulars, set_new_particulars] = useState('');
  const [new_remarks, set_new_remarks] = useState('');
  const [new_vouchno, set_new_vouchno] = useState('');
  const [new_rec, set_new_rec] = useState('');
  const [new_pay, set_new_pay] = useState('');
  const [new_balance, set_new_balance] = useState('');
  const [new_heads, set_new_heads] = useState('');
  const [new_heads2, set_new_heads2] = useState('');
  const [newManpower, setnewManpower] = useState('');
  const [newConsumables, setnewConsumables] = useState('');
  const [newTravel, setnewTravel] = useState('');
  const [newDemo, setnewDemo] = useState('');
  const [newOverheads, setnewOverheads] = useState('');
  const [newUnforeseenExpenses, setnewUnforeseenExpenses] = useState('');
  const [newEquipment, setnewEquipment] = useState('');
  const [newConstruction, setnewConstruction] = useState('');
  const [newFabrication, setnewFabrication] = useState('');
  const [whichTable, setwhichTable] = useState(0);
  const [newRecurring, setnewRecurring] = useState('');
  const [newNonRecurring, setnewNonRecurring] = useState('');
  const [currUpdateheads, setcurrUpdateheads] = useState('');
  const [committedOrNot, setcommittedOrNot] = useState('');
  const [oldPay, setoldPay] = useState('');
  const [openImportExcelPop, setOpenImportExcelPop] = useState(false);
  const [rec1, setrec1] = useState('');
  const [rec2, setrec2] = useState('');
  const [rec3, setrec3] = useState('');
  const [nonrec1, setnonrec1] = useState('');
  const [nonrec2, setnonrec2] = useState('');
  const [nonrec3, setnonrec3] = useState('');
  const [excelData, setexcelData] = useState([]);
  const [yearCtr, setyearCtr] = useState(1);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setexcelData(jsonData);
  };

  const processExcel = async () => {
    var arr = [];
    Object.keys(excelData).forEach(function (key) {
      arr.push(excelData[key]);
    });
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]['Heads'] == 'Grant') {
        if (yearCtr == 1) {
          const resp2 = await fetch(`${BACKEND_URL}/updated_add_fund`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
              particulars: arr[i]['Particulars'],
              remarks: arr[i]['Remarks'],
              vouchno: arr[i]['Voucher No. & Date'],
              recur: rec1,
              non_recur: nonrec1,
              project_id: props.projId,
            }),
          });

          const json_response = await resp2.json();

          const resp3 = await fetch(GET_MAIN_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response3 = await resp3.json();
          set_rows(json_response3);

          // update summary table
          const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response4 = await resp4.json();
          setsummaryrows(json_response4);
          set_new_particulars('');
          set_new_remarks('');
          set_new_vouchno('');
          set_new_rec('');
          set_new_pay('');
        } else if (yearCtr == 2) {
          const resp2 = await fetch(`${BACKEND_URL}/updated_add_fund`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
              particulars: arr[i]['Particulars'],
              remarks: arr[i]['Remarks'],
              vouchno: arr[i]['Voucher No. & Date'],
              recur: rec2,
              non_recur: nonrec2,
              project_id: props.projId,
            }),
          });

          const json_response = await resp2.json();

          const resp3 = await fetch(GET_MAIN_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response3 = await resp3.json();
          set_rows(json_response3);

          // update summary table
          const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response4 = await resp4.json();
          setsummaryrows(json_response4);
          set_new_particulars('');
          set_new_remarks('');
          set_new_vouchno('');
          set_new_rec('');
          set_new_pay('');
        } else {
          const resp2 = await fetch(`${BACKEND_URL}/updated_add_fund`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({
              particulars: arr[i]['Particulars'],
              remarks: arr[i]['Remarks'],
              vouchno: arr[i]['Voucher No. & Date'],
              recur: rec3,
              non_recur: nonrec3,
              project_id: props.projId,
            }),
          });

          const json_response = await resp2.json();

          const resp3 = await fetch(GET_MAIN_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response3 = await resp3.json();
          set_rows(json_response3);

          // update summary table
          const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'jwt-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({ project_id: props.projId }),
          });

          const json_response4 = await resp4.json();
          setsummaryrows(json_response4);
          set_new_particulars('');
          set_new_remarks('');
          set_new_vouchno('');
          set_new_rec('');
          set_new_pay('');
        }
        setyearCtr(yearCtr + 1);
      } else {
        if (
          arr[i]['Heads'] == 'Equipments' ||
          arr[i]['Heads'] == 'Fabrication'
        ) {
          var x = 'Non-Rec.';
        } else {
          x = 'Rec.';
        }
        const resp2 = await fetch(POST_INSERT_MAIN_TABLE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'jwt-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({
            particulars: arr[i]['Particulars'],
            remarks: arr[i]['Remarks'],
            vouchno: arr[i]['Voucher No. & Date'],
            // rec: new_rec,
            pay: Number(arr[i]['Payment']),
            // balance: new_balance,
            actual: 0,
            heads: x,
            heads2: arr[i]['Heads'],
            project_id: props.projId,
          }),
        });

        const json_response = await resp2.json();

        if (json_response == -1) {
          alert('Expenditure exceeds Sanctioned Amount, Request Denied!!');
          return;
        }

        const resp3 = await fetch(GET_MAIN_TABLE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'jwt-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({ project_id: props.projId }),
        });

        const json_response3 = await resp3.json();
        set_rows(json_response3);

        // update summary table
        const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'jwt-token': localStorage.getItem('token'),
          },
          body: JSON.stringify({ project_id: props.projId }),
        });

        const json_response4 = await resp4.json();
        setsummaryrows(json_response4);
        set_new_particulars('');
        set_new_remarks('');
        set_new_vouchno('');
        set_new_rec('');
        set_new_pay('');
      }
    }
    setOpenImportExcelPop(false);
  };

  const handleSubmit = async () => {
    var SUBMIT_URL;
    if (whichTable === 1) SUBMIT_URL = `${BACKEND_URL}/comment`;
    if (whichTable === 2) SUBMIT_URL = `${BACKEND_URL}/summary_comment`;
    const resp2 = await fetch(SUBMIT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        project_id: props.projId,
        row_no: rowId,
        comment_body: comment,
        prof_email: props.userEmail,
        prof_name: props.userName,
        is_admin: props.userFlag,
      }),
    });

    const json_response = await resp2.json();

    const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);

    const resp3 = await fetch(GET_MAIN_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);
    setOpenAddCommentPopup(false);
  };

  const sendmail = async () => {
    const resp2 = await fetch(`${BACKEND_URL}/sendMail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        project_id: props.projId,
        row_no: rowId,
        comment_body: comment,
        prof_email: props.userEmail,
        prof_name: props.userName,
      }),
    });

    const json_response = await resp2.json();

    setOpenAddCommentPopup(false);
  };

  const addNewExpensesRecord = async () => {
    const resp = await fetch(`${BACKEND_URL}/user/${props.userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
    });
    const response = await resp.json();

    if (response != 1) {
      alert('YOU ARE NOT THE ADMIN');
      return;
    }

    const resp2 = await fetch(POST_INSERT_MAIN_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        particulars: new_particulars,
        remarks: new_remarks,
        vouchno: new_vouchno,
        // rec: new_rec,
        pay: Number(new_pay),
        // balance: new_balance,
        actual: committedOrNot,
        heads: new_heads,
        heads2: new_heads2,
        project_id: props.projId,
      }),
    });

    const json_response = await resp2.json();

    if (json_response == -1) {
      alert('Expenditure exceeds Sanctioned Amount, Request Denied!!');
      return;
    }

    const resp3 = await fetch(GET_MAIN_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);
    set_new_particulars('');
    set_new_remarks('');
    set_new_vouchno('');
    set_new_rec('');
    set_new_pay('');
  };

  const addNewFunds = async () => {
    const resp = await fetch(`${BACKEND_URL}/user/${props.userEmail}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
    });
    const response = await resp.json();

    if (response != 1) {
      alert('YOU ARE NOT THE ADMIN');
      return;
    }

    const resp2 = await fetch(`${BACKEND_URL}/updated_add_fund`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({
        particulars: new_particulars,
        remarks: new_remarks,
        vouchno: new_vouchno,
        // rec:new_rec,
        recur: newRecurring,
        non_recur: newNonRecurring,
        project_id: props.projId,
        // manpower: newManpower,
        // consumables: newConsumables,
        // project_id: props.projId,
        // travel: newTravel,
        // field: newDemo,
        // overheads: newOverheads,
        // unforseen: newUnforeseenExpenses,
        // equipments: newEquipment,
        // construction: newConstruction,
        // fabrication: newFabrication,
      }),
    });

    const json_response = await resp2.json();

    const resp3 = await fetch(GET_MAIN_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'jwt-token': localStorage.getItem('token'),
      },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);
    set_new_particulars('');
    set_new_remarks('');
    set_new_vouchno('');
    set_new_rec('');
    set_new_pay('');
  };

  useEffect(() => {
    if (rowIdView > 0) {
      setOpenViewCommentPopup(true);
      //Todo: Set the Json data according to "rowIdView"
    } else {
      setOpenViewCommentPopup(false);
    }
  }, [rowIdView]);

  function rowSelector(flag) {
    if (flag === 1) return 'green';
    else return '';
  }

  return (
    <>
      <div className="soeTable">
        <Stack
          justifyContent="center"
          alignItems="center"
          direction="row"
          spacing={3}
          padding={1}
        >
          {props.userFlag == 1 ? (
            <>
              <Button
                variant="contained"
                onClick={async () => {
                  const resp = await fetch(
                    `${BACKEND_URL}/user/${props.userEmail}`,
                    {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json',
                        'jwt-token': localStorage.getItem('token'),
                      },
                    }
                  );
                  const response = await resp.json();

                  if (response != 1) {
                    alert('YOU ARE NOT THE ADMIN');
                    return;
                  }
                  setAddExpensesRowPop(true);
                }}
              >
                Add new expense
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setOpenAddFundsPopUp(true);
                }}
              >
                Add Funds
              </Button>

              <Button
                variant="contained"
                onClick={() => {
                  setOpenImportExcelPop(true);
                }}
              >
                Import Excel
              </Button>
            </>
          ) : (
            <></>
          )}

          <Button
            variant="contained"
            onClick={async () => {
              const resp2 = await fetch(GET_MAIN_TABLE_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'jwt-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ project_id: props.projId }),
              });

              const json_response = await resp2.json();
              set_rows(json_response);

              // update summary table
              const resp3 = await fetch(GET_SUMMARY_TABLE_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'jwt-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ project_id: props.projId }),
              });

              const json_response2 = await resp3.json();
              setsummaryrows(json_response2);
            }}
          >
            REFRESH TABLE
          </Button>
        </Stack>

        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button btn btn-primary mb-3"
          table="tbl1"
          filename={
            'StatementOfExpenses_' + props.projId.toString().substring(1)
          }
          sheet="Sheet1"
          buttonText="Export Expense Table to Excel Sheet"
        />
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: 700 }}
            aria-label="customized table"
            className="table"
            id="tbl1"
          >
            <TableHead>
              <TableRow>
                <StyledTableCell colspan={11} align="center">
                  Project ID: {props.projId.toString().substring(1)}, Project
                  Title: {props.project_title}, PI Name: {props.projProfName},
                  Total Cost: INR {props.project_grant}
                </StyledTableCell>
              </TableRow>
              <TableRow>
                <StyledTableCell align="center">Sr. No.</StyledTableCell>
                <StyledTableCell align="center">Particulars</StyledTableCell>
                <StyledTableCell align="center">Remarks</StyledTableCell>
                <StyledTableCell align="center">
                  Voucher No. & Date
                </StyledTableCell>
                <StyledTableCell align="center">Receipt</StyledTableCell>
                <StyledTableCell align="center">Payment</StyledTableCell>
                <StyledTableCell align="center">Balance</StyledTableCell>
                <StyledTableCell align="center">Heads</StyledTableCell>
                <StyledTableCell align="center">Comment</StyledTableCell>
                <StyledTableCell align="left">Actual Expense</StyledTableCell>
                {props.userFlag === 1 ? (
                  <StyledTableCell align="center"></StyledTableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow
                  key={row.sr}
                  className={rowSelector(row.comm_flag)}
                >
                  <StyledTableCell align="center" component="th" scope="row">
                    {row.sr}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.particulars}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.remarks}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.vouchno}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.rec != null ? '₹' + row.rec : null}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.payment != null ? '₹' + row.payment : null}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.balance != null ? '₹' + row.balance : null}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.heads}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={async () => {
                        setrowIdView(row.sr);
                        const resp2 = await fetch(
                          `${BACKEND_URL}/get_comment`,
                          {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'jwt-token': localStorage.getItem('token'),
                            },
                            body: JSON.stringify({
                              row_no: row.sr,
                              project_id: props.projId,
                              is_admin: props.userFlag,
                            }),
                          }
                        );

                        const json_response = await resp2.json();

                        setcommentJsonData(json_response);
                        // ViewComments(row.sr)
                      }}
                    />
                    <Button
                      style={{ width: '60px' }}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddCommentPopup(true);
                        setrowId(row.sr);
                        setwhichTable(1);
                      }}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.heads === 'Grant' ? null : (
                      <FormControl>
                        {/* <FormLabel id="demo-controlled-radio-buttons-group">
                        Gender
                      </FormLabel> */}
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          // value={value}
                          onChange={() => {
                            if (props.userFlag === 2) {
                              alert("You don't have admin access");
                            } else {
                              setOpenCommitPopup(true);
                              setoldPay(row.payment);
                              setrowId(row.sr);
                              set_new_heads(row.heads);
                            }
                          }}
                        >
                          <FormControlLabel
                            value="Actual"
                            checked={row.actual_flag == 0}
                            control={<Radio />}
                            label=""
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  </StyledTableCell>
                  {props.userFlag === 1 ? (
                    <StyledTableCell>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={async () => {
                          if (row.heads == 'Grant') {
                            alert('You cannot delete Grant row');
                          } else if (
                            window.confirm('Are you sure, you want to delete')
                          ) {
                            const resp2 = await fetch(
                              `${BACKEND_URL}/del_row`,
                              {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'jwt-token': localStorage.getItem('token'),
                                },
                                body: JSON.stringify({
                                  sr: row.sr,
                                  project_id: props.projId,
                                  heads: row.heads,
                                }),
                              }
                            );

                            const json_response = await resp2.json();

                            const resp3 = await fetch(GET_MAIN_TABLE_URL, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'jwt-token': localStorage.getItem('token'),
                              },
                              body: JSON.stringify({
                                project_id: props.projId,
                              }),
                            });

                            const json_response3 = await resp3.json();
                            set_rows(json_response3);

                            // update summary table
                            const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                'jwt-token': localStorage.getItem('token'),
                              },
                              body: JSON.stringify({
                                project_id: props.projId,
                              }),
                            });

                            const json_response4 = await resp4.json();
                            setsummaryrows(json_response4);
                          }
                        }}
                      />
                    </StyledTableCell>
                  ) : null}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />

        <center>
          <h2>Summary Table</h2>{' '}
        </center>

        <ReactHTMLTableToExcel
          id="test-table-xls-button2"
          className="download-table-xls-button btn btn-primary mb-3"
          table="table-to-xls2"
          filename={'Summary_' + props.projId.toString().substring(1)}
          sheet="Sheet1"
          buttonText="Export Summary Table to Excel Sheet"
        />
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          className="table"
          id="table-to-xls2"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell colspan={12} align="center">
                Project ID: {props.projId.toString().substring(1)}, Project
                Title: {props.project_title}, PI Name: {props.projProfName},
                Total Cost: INR {props.project_grant}
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell align="left">Heads</StyledTableCell>
              <StyledTableCell align="left">Sanctioned Amount</StyledTableCell>
              <StyledTableCell align="left">Funds 1YR</StyledTableCell>
              <StyledTableCell align="left">Funds 2YR</StyledTableCell>
              <StyledTableCell align="left">Funds 3YR</StyledTableCell>
              {/* <StyledTableCell align="left">Funds 4YR</StyledTableCell>
              <StyledTableCell align="left">Funds 5YR</StyledTableCell> */}
              <StyledTableCell align="left">Expenditure</StyledTableCell>
              <StyledTableCell align="left">Balance</StyledTableCell>
              <StyledTableCell align="left">Comment</StyledTableCell>
              {props.userFlag === 1 ? (
                <StyledTableCell align="left"></StyledTableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryrows.map((row) => (
              <StyledTableRow
                key={row.sr}
                className={rowSelector(row.comm_flag)}
              >
                <StyledTableCell component="th" scope="row">
                  {row.sr}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {row.heads}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.heads === 'Misc Rec.' ||
                  row.heads === 'Misc Non Rec.' ? (
                    <span
                      style={
                        row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                          ? { fontWeight: 'bold' }
                          : { fontWeight: '' }
                      }
                    >
                      0
                    </span>
                  ) : (
                    <span
                      style={
                        row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                          ? { fontWeight: 'bold' }
                          : { fontWeight: '' }
                      }
                    >
                      {'₹' + row.sanctioned_amount}
                    </span>
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {'₹' + row.year_1_funds}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {'₹' + row.year_2_funds}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {'₹' + row.year_3_funds}
                  </span>
                </StyledTableCell>
                {/* <StyledTableCell align="left"> */}
                {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                {/* </StyledTableCell> */}
                {/* <StyledTableCell align="left"> */}
                {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                {/* </StyledTableCell> */}
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {'₹' + row.expenditure}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left">
                  <span
                    style={
                      row.heads === 'Rec.' || row.heads === 'Non-Rec.'
                        ? { fontWeight: 'bold' }
                        : { fontWeight: '' }
                    }
                  >
                    {'₹' + row.balance}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {/* <Stack  direction="row"  spacing={-5}> */}
                  <Button
                    startIcon={<RemoveRedEyeIcon />}
                    onClick={async () => {
                      setrowIdView(row.sr);
                      const resp2 = await fetch(
                        `${BACKEND_URL}/get_summary_comment`,
                        {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'jwt-token': localStorage.getItem('token'),
                          },
                          body: JSON.stringify({
                            row_no: row.sr,
                            project_id: props.projId,
                            is_admin: props.userFlag,
                          }),
                        }
                      );

                      const json_response = await resp2.json();

                      setcommentJsonData(json_response);
                      // ViewComments(row.sr)
                    }}
                  />
                  <Button
                    style={{ width: '60px' }}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setOpenAddCommentPopup(true);
                      setrowId(row.sr);
                      setwhichTable(2);
                    }}
                  />
                </StyledTableCell>
                {props.userFlag === 1 ? (
                  <StyledTableCell align="left">
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => {
                        setcurrUpdateheads(row.heads);
                        setOpenEditPopup(true);
                        setrowId(row.sr);
                      }}
                    />
                  </StyledTableCell>
                ) : null}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddCommentPopup
        openAddCommentPopup={openAddCommentPopup}
        setOpenAddCommentPopup={setOpenAddCommentPopup}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '500px' } }}
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
                style={{ float: 'right' }}
                onClick={() => setOpenAddCommentPopup(false)}
              />
              <TextField
                id="outlined-multiline-static"
                label="Comment"
                multiline
                rows={4}
                defaultValue=""
                bgcolor="white"
                sx={{ zIndex: 'tooltip' }}
                onChange={(event) => {
                  setComment(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={() => {
                    handleSubmit();
                    sendmail();
                  }}
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
              style={{ float: 'right' }}
              onClick={async () => {
                const resp3 = await fetch(GET_MAIN_TABLE_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'jwt-token': localStorage.getItem('token'),
                  },
                  body: JSON.stringify({ project_id: props.projId }),
                });

                const json_response3 = await resp3.json();
                set_rows(json_response3);

                // update summary table
                const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'jwt-token': localStorage.getItem('token'),
                  },
                  body: JSON.stringify({ project_id: props.projId }),
                });

                const json_response4 = await resp4.json();
                setsummaryrows(json_response4);
                setOpenViewCommentPopup(false);
                setrowIdView(0);
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
                    {/* <StyledTableCell align="right">Resolved</StyledTableCell> */}
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
                      {/* <StyledTableCell align="right">
                        {row.resolved}
                      </StyledTableCell> */}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </span>
        </div>
      </ViewCommentPopup>
      <CommitPopup
        openCommitPopup={openCommitPopup}
        setOpenCommitPopup={setOpenCommitPopup}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '500px' } }}
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
                style={{ float: 'right' }}
                onClick={() => setOpenCommitPopup(false)}
              />
              <TextField
                type="number"
                id="outlined-basic"
                label="New Expense"
                variant="outlined"
                onChange={(event) => {
                  setNewExpense(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={async () => {
                    const resp2 = await fetch(`${BACKEND_URL}/to_actual`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'jwt-token': localStorage.getItem('token'),
                      },
                      body: JSON.stringify({
                        sr: rowId,
                        p_id: props.projId,
                        new_pay: Number(NewExpense),
                        old_pay: oldPay,
                        heads: new_heads,
                      }),
                    });

                    const json_response = await resp2.json();

                    const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'jwt-token': localStorage.getItem('token'),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response4 = await resp4.json();
                    setsummaryrows(json_response4);

                    const resp3 = await fetch(GET_MAIN_TABLE_URL, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'jwt-token': localStorage.getItem('token'),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response3 = await resp3.json();
                    set_rows(json_response3);
                    setOpenCommitPopup(false);
                  }}
                >
                  Update
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </CommitPopup>
      <EditPopup
        openEditPopup={openEditPopup}
        setOpenEditPopup={setOpenEditPopup}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { m: 1, width: '500px' } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="Edit">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: 'right' }}
                onClick={() => setOpenEditPopup(false)}
              />
              <TextField
                type="number"
                id="outlined-basic"
                label="New Sanctioned Amount"
                variant="outlined"
                onChange={(event) => {
                  setEdit(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={async () => {
                    const resp2 = await fetch(
                      `${BACKEND_URL}/edit_sanctioned`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'jwt-token': localStorage.getItem('token'),
                        },
                        body: JSON.stringify({
                          project_id: props.projId,
                          sanc: Edit,
                          heads: currUpdateheads,
                        }),
                      }
                    );

                    const json_response = await resp2.json();

                    setOpenEditPopup(false);

                    const resp4 = await fetch(GET_SUMMARY_TABLE_URL, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'jwt-token': localStorage.getItem('token'),
                      },
                      body: JSON.stringify({ project_id: props.projId }),
                    });

                    const json_response4 = await resp4.json();
                    setsummaryrows(json_response4);
                  }}
                >
                  Update
                </Button>
              </center>
            </span>
          </div>
        </Box>
      </EditPopup>
      <AddExpensesRowPopUp
        AddExpensesRowPop={AddExpensesRowPop}
        setAddExpensesRowPop={setAddExpensesRowPop}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { width: '600px' } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="addExpenses">
            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >
              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: 'right' }}
                onClick={() => {
                  set_new_heads('Heads');
                  setAddExpensesRowPop(false);
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Particulars"
                variant="outlined"
                onChange={(event) => {
                  set_new_particulars(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                onChange={(event) => {
                  set_new_remarks(event.target.value);
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
                style={{ width: 700 }}
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
                type="number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Payment"
                variant="outlined"
                onChange={(event) => {
                  set_new_pay(event.target.value);
                }}
              />

              {/* <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Balance"
                variant="outlined"
                onChange={(event) => {
                  set_new_balance(event.target.value);
                }}
              /> */}

              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={new_heads}
                  label="Age"
                  onChange={(event) => {
                    set_new_heads(event.target.value);
                  }}
                >
                  <MenuItem value={'Rec.'}>Recurring</MenuItem>
                  <MenuItem value={'Non-Rec.'}>Non-Recurring</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              {new_heads === 'Rec.' ? (
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="demo-simple-select-label2">Heads</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select2"
                    value={new_heads2}
                    label="Age"
                    onChange={(event) => {
                      set_new_heads2(event.target.value);
                    }}
                  >
                    <MenuItem value={'Manpower'}>Manpower</MenuItem>
                    <MenuItem value={'Consumables'}>Consumables</MenuItem>
                    <MenuItem value={'Travel'}>Travel</MenuItem>
                    <MenuItem value={'Field Testing/Demo/Tranings'}>
                      Field Testing/Demo/Tranings
                    </MenuItem>
                    <MenuItem value={'Overheads'}>Overheads</MenuItem>
                    <MenuItem value={'Unforseen Expenses'}>
                      Unforseen Expenses
                    </MenuItem>
                    <MenuItem value={'Fabrication'}>Fabrication</MenuItem>
                    <MenuItem value={'Misc Rec.'}>
                      Miscellaneous(Recurring)
                    </MenuItem>
                  </Select>
                </FormControl>
              ) : (
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="demo-simple-select-label2">Heads</InputLabel>
                  <Select
                    labelId="demo-simple-select-label2"
                    id="demo-simple-select2"
                    value={new_heads2}
                    label="Age"
                    onChange={(event) => {
                      set_new_heads2(event.target.value);
                    }}
                  >
                    <MenuItem value={'Equipments'}>Equipment</MenuItem>
                    <MenuItem value={'Construction'}>Construction</MenuItem>

                    <MenuItem value={'Misc Non Rec.'}>
                      Miscellaneous(Non-Recurring)
                    </MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControl variant="standard" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Commit Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  OpenAddFundsPopUp
                  value={committedOrNot}
                  label="Age"
                  onChange={(event) => {
                    setcommittedOrNot(event.target.value);
                  }}
                >
                  <MenuItem value={'1'}>Committed</MenuItem>
                  <MenuItem value={'0'}>Actual</MenuItem>
                </Select>
              </FormControl>
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
      <AddFundsPopUp
        openAddFundsPopUp={openAddFundsPopUp}
        setOpenAddFundsPopUp={setOpenAddFundsPopUp}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { width: '600px' } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="addFunds">
            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >
              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: 'right' }}
                onClick={() => {
                  setOpenAddFundsPopUp(false);
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Particulars"
                variant="outlined"
                onChange={(event) => {
                  set_new_particulars(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Remarks"
                variant="outlined"
                onChange={(event) => {
                  set_new_remarks(event.target.value);
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
                style={{ width: 800 }}
                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
              {/* <TextField
                type="number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Receipt (Total Funds to be Added)"
                variant="outlined"
                onChange={(event) => {
                  set_new_rec(event.target.value);
                }}
              /> */}
            </Stack>
            <center className="paddingFix">
              <h6>Enter the Amount under the following categories/Heads : </h6>{' '}
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
            <br></br>
            <br></br>
            <TextField
              type="number"
              id="outlined-basic"
              label="Non-recurring"
              variant="outlined"
              onChange={(event) => {
                setnewNonRecurring(event.target.value);
              }}
            />
            {/* <Stack
              justifyContent="center"
              alignItems="center"
              direction="row"
              spacing={3}
              padding={1}
            >
              <TextField
                type = "number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Manpower"
                variant="outlined"
                onChange={(event) => {
                  setnewManpower(event.target.value);
                }}
              />
              <TextField
                type = "number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Consumables"
                variant="outlined"
                onChange={(event) => {
                  setnewConsumables(event.target.value);
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
                type = "number"
                id="outlined-basic"
                label="Travel"
                variant="outlined"
                onChange={(event) => {
                  setnewTravel(event.target.value);
                }}
              />
              <TextField
                type = "number"
                id="outlined-basic"
                label="Field Testing/Demo/Tranings"
                variant="outlined"
                onChange={(event) => {
                  setnewDemo(event.target.value);
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
                type = "number"
                id="outlined-basic"
                label="Overhead"
                variant="outlined"
                onChange={(event) => {
                  setnewOverheads(event.target.value);
                }}
              />
              <TextField
                type = "number"
                id="outlined-basic"
                label="Unforseen Expenses"
                variant="outlined"
                onChange={(event) => {
                  setnewUnforeseenExpenses(event.target.value);
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
                type = "number"
                id="outlined-basic"
                label="Equipment"
                variant="outlined"
                onChange={(event) => {
                  setnewEquipment(event.target.value);
                }}
              />
              <TextField
                type = "number"
                id="outlined-basic"
                label="Construction"
                variant="outlined"
                onChange={(event) => {
                  setnewConstruction(event.target.value);
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
                type = "number"
                id="outlined-basic"
                label="Fabrication"
                variant="outlined"
                onChange={(event) => {
                  setnewFabrication(event.target.value);
                }}
              />
            </Stack> */}
            <center>
              <Button
                onClick={() => {
                  addNewFunds();
                  setOpenAddFundsPopUp(false);
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Add Funds
              </Button>
            </center>
          </div>
        </Box>
      </AddFundsPopUp>

      {/* /Excel Import compoment   */}

      <ImportExcelPop
        openImportExcelPop={openImportExcelPop}
        setOpenImportExcelPop={setOpenImportExcelPop}
      >
        <Box
          component="form"
          sx={{ '& .MuiTextField-root': { width: '600px' } }}
          noValidate
          autoComplete="off"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <div className="addFunds">
            <Stack
              justifyContent="right"
              alignItems="right"
              direction="row"
              spacing={3}
              padding={1}
            >
              <Button
                className="CloseAddProjectPopup"
                startIcon={<CloseIcon />}
                style={{ float: 'right' }}
                onClick={() => {
                  setOpenImportExcelPop(false);
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 1st Year"
                variant="outlined"
                onChange={(event) => {
                  setrec1(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec. 1st Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec1(event.target.value);
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 2nd Year"
                variant="outlined"
                onChange={(event) => {
                  setrec2(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec 2nd Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec2(event.target.value);
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Rec 3rd Year"
                variant="outlined"
                onChange={(event) => {
                  setrec3(event.target.value);
                }}
              />
              <TextField
                style={{ width: 500 }}
                id="outlined-basic"
                label="Non-Rec 3rd Year"
                variant="outlined"
                onChange={(event) => {
                  setnonrec3(event.target.value);
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
              <input
                type="file"
                onChange={(e) => {
                  handleFile(e);
                }}
              />
            </Stack>

            <center>
              <Button
                onClick={() => {
                  processExcel();
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Import
              </Button>
            </center>
          </div>
        </Box>
      </ImportExcelPop>
    </>
  );
}
