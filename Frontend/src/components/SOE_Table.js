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
import EditPopup from "./EditPopup";
import ViewCommentPopup from "./ViewCommentPopup";
import CommentViewData from "./CommentViewData.json";
import AddExpensesRowPopUp from "./AddExpensesRowPop";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddFundsPopUp from "./AddFundsPopup";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { green } from "@mui/material/colors";

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
    // backgroundColor: theme.palette.action.hover,
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
    setsummaryrows(props.summary_table_data);
  }, [props.table_data, props.summary_table_data]);

  // const [rows,set_rows] = useState(props.data);
  const [rows, set_rows] = useState(props.table_data);
  const [summaryrows, setsummaryrows] = useState(props.summary_table_data);
  console.log("Project id = " + props.projId);
  console.log(rows);
  const [comment, setComment] = useState("");
  const [openAddCommentPopup, setOpenAddCommentPopup] = useState(false);
  const [openEditPopup, setOpenEditPopup] = useState(false);
  const [Edit, setEdit] = useState("")
  const [openViewCommentPopup, setOpenViewCommentPopup] = useState(false);
  const [openAddFundsPopUp, setOpenAddFundsPopUp] = useState(false);
  const [rowId, setrowId] = useState(0);
  const [rowIdView, setrowIdView] = useState(0);
  const [commentJsonData, setcommentJsonData] = useState(CommentViewData);
  const [AddExpensesRowPop, setAddExpensesRowPop] = useState(false);
  const [new_sr, set_new_sr] = useState("");
  const [new_particulars, set_new_particulars] = useState("");
  const [new_remarks, set_new_remarks] = useState("");
  const [new_vouchno, set_new_vouchno] = useState("");
  const [new_rec, set_new_rec] = useState("");
  const [new_pay, set_new_pay] = useState("");
  const [new_balance, set_new_balance] = useState("");
  const [new_heads, set_new_heads] = useState("");
  const [new_heads2, set_new_heads2] = useState("");
  const [newManpower, setnewManpower] = useState("");
  const [newConsumables, setnewConsumables] = useState("");
  const [newTravel, setnewTravel] = useState("");
  const [newDemo, setnewDemo] = useState("");
  const [newOverheads, setnewOverheads] = useState("");
  const [newUnforeseenExpenses, setnewUnforeseenExpenses] = useState("");
  const [newEquipment, setnewEquipment] = useState("");
  const [newConstruction, setnewConstruction] = useState("");
  const [newFabrication, setnewFabrication] = useState("");
  const [whichTable, setwhichTable] = useState(0)
  const [newRecurring, setnewRecurring] = useState("")
  const [newNonRecurring, setnewNonRecurring] = useState("")
  const [currUpdateheads, setcurrUpdateheads] = useState("")

  const handleSubmit = async () => {
    console.log(comment);
    console.log(rowId);
    console.log("Table", whichTable)
    var server_address;
    if(whichTable === 1)
    server_address = "http://localhost:5000/comment";
    if(whichTable === 2)
    server_address = "http://localhost:5000/summary_comment";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    console.log(json_response);

    setOpenAddCommentPopup(false);
  };

  

  const sendmail = async () => {
    console.log(comment);
    console.log(rowId);

    var server_address = "http://localhost:5000/sendMail";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: props.projId,
        row_no: rowId,
        comment_body: comment,
        prof_email: props.userEmail,
        prof_name: props.userName
      }),
    });

    const json_response = await resp2.json();
    console.log(json_response)

    setOpenAddCommentPopup(false);
  };

  var tablesToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
      + '<Styles>'
      + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
      + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
      + '</Styles>' 
      + '{worksheets}</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
    , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(tables, wsnames, wbname, appname) {
      var ctx = "";
      var workbookXML = "";
      var worksheetsXML = "";
      var rowsXML = "";
    
      for (var i = 0; i < tables.length; i++) {
        if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
        for (var j = 0; j < tables[i].rows.length; j++) {
          rowsXML += '<Row>'
          for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
            var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
            var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
            var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
            dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
            var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
            dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
            ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                   , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                   , data: (dataFormula)?'':dataValue
                   , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                  };
            rowsXML += format(tmplCellXML, ctx);
          }
          rowsXML += '</Row>'
        }
        ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
      }
    
      ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
      workbookXML = format(tmplWorkbookXML, ctx);
    
    console.log(workbookXML);
    
      var link = document.createElement("A");
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
     })();

  const addNewExpensesRecord = async () => {
    var server_address2 = "http://localhost:5000/user/" + props.userEmail;
    const resp = await fetch(server_address2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);

    if (response != 1) {
      alert("YOU ARE NOT THE ADMIN");
      return;
    }

    var server_address = "http://localhost:5000/insert_main_table";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        particulars: new_particulars,
        remarks: new_remarks,
        vouchno: new_vouchno,
        rec: new_rec,
        pay: Number(new_pay),
        // balance: new_balance,
        heads: new_heads,
        heads2: new_heads2,
        project_id: props.projId,
      }),
    });

    const json_response = await resp2.json();
    console.log("RESPONSEEE->" + json_response);

    if(json_response == -1){
      alert("Expenditure exceeds Sanctioned Amount, Request Denied!!")
      return;
    }

    var server_address3 = "http://localhost:5000/get_main_table";
    const resp3 = await fetch(server_address3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    var server_address4 = "http://localhost:5000/get_summary_table";
    const resp4 = await fetch(server_address4, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);
    set_new_particulars("");
    set_new_remarks("");
    set_new_vouchno("");
    set_new_rec("");
    set_new_pay("");
  };

  const addNewFunds = async () => {
    var server_address2 = "http://localhost:5000/user/" + props.userEmail;
    const resp = await fetch(server_address2, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const response = await resp.json();
    console.log("Server response", response);

    if (response != 1) {
      alert("YOU ARE NOT THE ADMIN");
      return;
    }

    var server_address = "http://localhost:5000/updated_add_fund";
    const resp2 = await fetch(server_address, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        particulars: new_particulars,
        remarks:new_remarks,
        vouchno:new_vouchno,
        rec:new_rec,
        recur:newRecurring,
        non_recur:newNonRecurring,
        project_id: props.projId
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
    console.log("RESPONSEEE->" + json_response);

    var server_address3 = "http://localhost:5000/get_main_table";
    const resp3 = await fetch(server_address3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    var server_address4 = "http://localhost:5000/get_summary_table";
    const resp4 = await fetch(server_address4, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);
    set_new_particulars("");
    set_new_remarks("");
    set_new_vouchno("");
    set_new_rec("");
    set_new_pay("");
  };

  useEffect(() => {
    if (rowIdView > 0) {
      console.log(rowIdView);
      setOpenViewCommentPopup(true);
      //Todo: Set the Json data according to "rowIdView"
    } else {
      setOpenViewCommentPopup(false);
    }
  }, [rowIdView]);


  function rowSelector(flag){
    // console.log("GG")
    
    if(flag===1) return 'green';
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
          {props.userFlag==1 ? (
        <><Button
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
                  return;
                }
                setAddExpensesRowPop(true);
              } }
            >
              Add new expense
            </Button><Button
              variant="contained"
              onClick={() => {
                setOpenAddFundsPopUp(true);
              } }
            >
                Add Funds
              </Button></>
      ) : (
        <></>
      )}
          
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

              // update summary table
              server_address = "http://localhost:5000/get_summary_table";
              const resp3 = await fetch(server_address, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
          table="table-to-xls"
          filename="StatementOfExpenses"
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
                <StyledTableCell align="center"></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.sr} className={rowSelector(row.comm_flag)}>
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
                  <StyledTableCell align="center">{row.rec}</StyledTableCell>
                  <StyledTableCell align="center">
                    {row.payment}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.balance}
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.heads}</StyledTableCell>
                  <StyledTableCell align="right">
                    {/* <Stack  direction="row"  spacing={-5}> */}
                    <Button
                      startIcon={<RemoveRedEyeIcon />}
                      onClick={async () => {
                        setrowIdView(row.sr);
                        var server_address =
                          "http://localhost:5000/get_comment";
                        const resp2 = await fetch(server_address, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            row_no: row.sr,
                            project_id: props.projId,
                            is_admin:props.userFlag,
                          }),
                        });

                        const json_response = await resp2.json();
                        console.log(json_response);
                        setcommentJsonData(json_response);
                        // ViewComments(row.sr)
                      }}
                    />
                    <Button
                      style={{ width: "60px" }}
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddCommentPopup(true);
                        setrowId(row.sr);
                        setwhichTable(1);
                      }}
                    />
                    
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button startIcon={<DeleteIcon/>} 
                    onClick={async() => {
                      if(row.heads=="Grant"){
                        alert("You cannot delete Grant row");
                      }
                      else if(window.confirm("Are you sure, you want to delete"))
                      {
                        var server_address =
                        "http://localhost:5000/del_row";
                      const resp2 = await fetch(server_address, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          sr: row.sr,
                          project_id: props.projId,
                          heads: row.heads,
                        }),
                      });

                      const json_response = await resp2.json();
                      console.log(json_response);

                      var server_address3 = "http://localhost:5000/get_main_table";
    const resp3 = await fetch(server_address3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    var server_address4 = "http://localhost:5000/get_summary_table";
    const resp4 = await fetch(server_address4, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response4 = await resp4.json();
    setsummaryrows(json_response4);
                      }

                    }}
                    />
                    </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <br />

        <center>
          <h2>Summary Table</h2>{" "}
        </center>

        <ReactHTMLTableToExcel
          id="test-table-xls-button2"
          className="download-table-xls-button btn btn-primary mb-3"
          table="table-to-xls2"
          filename="Summary"
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
              <StyledTableCell>Sr. No.</StyledTableCell>
              <StyledTableCell align="left">Heads</StyledTableCell>
              <StyledTableCell align="left">
                Sanctioned Amount
              </StyledTableCell>
              <StyledTableCell align="left">
                Funds 1YR
              </StyledTableCell>
              <StyledTableCell align="left">
              Funds 2YR
              </StyledTableCell>
              <StyledTableCell align="left">
              Funds 3YR
              </StyledTableCell>
              <StyledTableCell align="left">
              Funds 4YR
              </StyledTableCell>
              <StyledTableCell align="left">
              Funds 5YR
              </StyledTableCell>
              <StyledTableCell align="left">Expenditure</StyledTableCell>
              <StyledTableCell align="left">Balance</StyledTableCell>
              <StyledTableCell align="left">Comment</StyledTableCell>
              <StyledTableCell align="left"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaryrows.map((row) => (
              <StyledTableRow key={row.sr} className={rowSelector(row.comm_flag)}>
                <StyledTableCell component="th" scope="row">
                  {row.sr}
                </StyledTableCell>
                <StyledTableCell align="left"><span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.heads}</span></StyledTableCell>
                <StyledTableCell align="left">
                {row.heads==="Misc Rec." || row.heads==="Misc Non Rec." ? (
                  <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>0</span>
                ):(
                  <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.sanctioned_amount}</span>
                )}
                
                </StyledTableCell>
                <StyledTableCell align="left">
                <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_1_funds}</span>
                </StyledTableCell>
                <StyledTableCell align="left">
                <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_2_funds}</span>
                </StyledTableCell>
                <StyledTableCell align="left">
                <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span>
                </StyledTableCell>
                <StyledTableCell align="left">
                {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                </StyledTableCell>
                <StyledTableCell align="left">
                {/* <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.year_3_funds}</span> */}
                </StyledTableCell>
                <StyledTableCell align="left">
                <span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.expenditure}</span>
                </StyledTableCell>
                <StyledTableCell align="left"><span style={row.heads === "Rec." || row.heads === "Non-Rec." ?{fontWeight: 'bold', fontSize:'large'}:{fontWeight: ''}}>{row.balance}</span></StyledTableCell>
                <StyledTableCell align="left">
                  {/* <Stack  direction="row"  spacing={-5}> */}
                  <Button
                    startIcon={<RemoveRedEyeIcon />}
                    onClick={async () => {
                      setrowIdView(row.sr);
                      var server_address = "http://localhost:5000/get_summary_comment";
                      const resp2 = await fetch(server_address, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          row_no: row.sr,
                          project_id: props.projId,
                          is_admin:props.userFlag,
                        }),
                      });

                      const json_response = await resp2.json();
                      console.log(json_response);
                      setcommentJsonData(json_response);
                      // ViewComments(row.sr)
                    }}
                  />
                  <Button
                    style={{ width: "60px" }}
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setOpenAddCommentPopup(true);
                      setrowId(row.sr);
                      setwhichTable(2);
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell align="left"><Button
                    
                    startIcon={<EditIcon />}
                    onClick={() => {
                      setcurrUpdateheads(row.heads);
                      setOpenEditPopup(true);
                      setrowId(row.sr);
                      
                    }}
                  /></StyledTableCell>
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
                  // onClick={handleSubmit}
                  onClick={() => { handleSubmit(); sendmail();}}
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
              onClick={async() => {
                var server_address3 = "http://localhost:5000/get_main_table";
    const resp3 = await fetch(server_address3, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: props.projId }),
    });

    const json_response3 = await resp3.json();
    set_rows(json_response3);

    // update summary table
    var server_address4 = "http://localhost:5000/get_summary_table";
    const resp4 = await fetch(server_address4, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      <EditPopup
        openEditPopup={openEditPopup}
        setOpenEditPopup={setOpenEditPopup}
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
          <div className="Edit">
            <span>
              <Button
                startIcon={<CloseIcon />}
                style={{ float: "right" }}
                onClick={() => setOpenEditPopup(false)}
              />
              <TextField
                id="outlined-multiline-static"
                label="New Sanctioned Amount"
                multiline
                rows={4}
                defaultValue=""
                bgcolor="white"
                sx={{ zIndex: "tooltip" }}
                onChange={(event) => {
                  setEdit(event.target.value);
                }}
              />
              <center>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  // onClick={handleSubmit}
                  onClick={async() => {

                    var server_address = "http://localhost:5000/edit_sanctioned";
                    const resp2 = await fetch(server_address, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        project_id: props.projId,
                        sanc: Edit,
                        heads: currUpdateheads,

                      }),
                    });
                
                    const json_response = await resp2.json();
                    console.log(json_response)
                    setOpenEditPopup(false);

                    var server_address4 = "http://localhost:5000/get_summary_table";
    const resp4 = await fetch(server_address4, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          sx={{ "& .MuiTextField-root": { width: "600px" } }}
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
                style={{ float: "right" }}
                onClick={() => {
                  set_new_heads("Heads");
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
              <TextField
                type = "number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Receipt"
                variant="outlined"
                onChange={(event) => {
                  set_new_rec(event.target.value);
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

<FormControl fullWidth>
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
                  <MenuItem value={"Rec."}>Recurring</MenuItem>
                  <MenuItem value={"Non-Rec."}>Non-Recurring</MenuItem>
                </Select>
              </FormControl>
              {new_heads==="Rec." ?(
                <FormControl fullWidth>
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
                  
                  <MenuItem value={"Manpower"}>Manpower</MenuItem>
                  <MenuItem value={"Consumables"}>Consumables</MenuItem>
                  <MenuItem value={"Travel"}>Travel</MenuItem>
                  <MenuItem value={"Field Testing/Demo/Tranings"}>
                    Field Testing/Demo/Tranings
                  </MenuItem>
                  <MenuItem value={"Overheads"}>Overheads</MenuItem>
                  <MenuItem value={"Unforseen Expenses"}>
                    Unforseen Expenses
                  </MenuItem>
                  <MenuItem value={"Fabrication"}>Fabrication</MenuItem>
                  <MenuItem value={"Misc Rec."}>Miscellaneous(Recurring)</MenuItem>
                  
                </Select>
              </FormControl>
              ):(
<FormControl fullWidth>
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
                  
                 
                  <MenuItem value={"Equipments"}>Equipment</MenuItem>
                  <MenuItem value={"Construction"}>Construction</MenuItem>
                 
                  <MenuItem value={"Misc Non Rec."}>Miscellaneous(Non-Recurring)</MenuItem>
                </Select>
              </FormControl>
              )}
              
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
          sx={{ "& .MuiTextField-root": { width: "600px" } }}
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
                style={{ float: "right" }}
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
                style={{ width: 500 }}
                id="outlined-basic"
                label="Voucher No. and Date"
                variant="outlined"
                onChange={(event) => {
                  set_new_vouchno(event.target.value);
                }}
              />
              <TextField
                type = "number"
                style={{ width: 500 }}
                id="outlined-basic"
                label="Receipt (Total Funds to be Added)"
                variant="outlined"
                onChange={(event) => {
                  set_new_rec(event.target.value);
                }}
              />
            </Stack>
            <center>
              Enter the Amount under the following categories/Heads:-{" "}
            </center>
            <TextField type="number" id="outlined-basic" label="Recurring" variant="outlined"
              onChange={(event) => {
                setnewRecurring(event.target.value);
              }}
            />
            <br></br><br></br>
            <TextField type="number" id="outlined-basic" label="Non-recurring" variant="outlined"
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
    </>
  );
}