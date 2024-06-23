var express = require('express');
const pool = require('./components/db');
var app = express();
require('dotenv').config();

const listOfProjects = require('./components/listOfProjects');
const addUser = require('./components/addUser');
const userType = require('./components/userType');
const getUser = require('./components/getUser');
const getMainTable = require('./components/getMainTable');
const getSummaryTable = require('./components/getSummaryTable');
const insertMainTable = require('./components/insertMainTable');
const specificProject = require('./components/specificProject');
const createProject = require('./components/createProject');
const addFund = require('./components/addFund');
const addComment = require('./components/addComment');
const sendCommentNotification = require('./components/sendMail');
const getComment = require('./components/getComment');
const showProjects = require('./components/showProjects');
const addSummaryComment = require('./components/addSummaryComment');
const getSummaryComment = require('./components/getSummaryComment');
const updatedAddFund = require('./components/updatedAddFund');
const delrow = require('./components/delrow');
const editSanctioned = require('./components/editSanctioned');
const delUser = require('./components/delUser');
const delProject = require('./components/delProject');
const ToActual = require('./components/ToActual');

// cors allows communication from differnt domains(requests to our server)
const cors = require('cors');

const PORT = process.env.PORT || 8000;

//creating middleware
app.use(cors());

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const OAuthClientID = process.env.OAuth_CLIENT_ID;
const client = new OAuth2Client(OAuthClientID);

//allowing us to extract json data from a request
app.use(express.json());

app.use(express.static('public'));

function verifyToken(req, res, next) {
  // extracting token from the header of the request
  const token = req.headers['jwt-token'];

  if (!token) {
    // if token not received then send a msg that we need token
    res.send('Please supply token');
  } else {
    // else verify that the token is correct

    jwt.verify(token, 'jwtTempSecret', (err, authData) => {
      if (err) {
        res.json({
          auth: false,
          message: 'authentication failure',
        });
      } else {
        //go to next in case the token is verified
        next();
      }
    });
  }
}

app.post('/test_temp', verifyToken, (req, res) => {
  res.json(699);
});

app.post('/authenticate', async function (req, res) {
  try {
    // the body that we received

    var query2 = "SELECT * FROM users where email_id = '";
    query2 = query2.concat(req.body.email);
    query2 = query2.concat("'");

    const db_res = await pool.query(query2);

    if (db_res.rows[0] == undefined) {
      // if the user himself is not valid then send -1
      res.json(-1);
    } else {
      const { token } = req.body;

      // verifying the google login sent
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: OAuthClientID,
      });

      // making jwt token

      const email_id = db_res.rows[0].email_id;
      const jwt_token = jwt.sign({ email_id }, 'jwtTempSecret', {
        // value 300 corresponds to 5 mins
        expiresIn: 18000,
      });

      res.json({
        auth: true,
        token: jwt_token,
      });
    }
  } catch (error) {
    console.error(error.message);
  }
});

//Routes
app.get('/user/:email', verifyToken, userType.userType);
app.post('/user', verifyToken, addUser.addUser);
app.post('/get_user', verifyToken, getUser.getUser);
app.post('/get_main_table', verifyToken, getMainTable.getMainTable);
app.post('/get_summary_table', verifyToken, getSummaryTable.getSummaryTable);
app.post('/insert_main_table', verifyToken, insertMainTable.insertMainTable);
app.post('/project', verifyToken, listOfProjects.listOfProjects);
app.post('/project_search', verifyToken, specificProject.specificProject);
app.post('/create_project', verifyToken, createProject.createProject);
app.post('/fund', verifyToken, addFund.addFund);
app.post('/comment', verifyToken, addComment.addComment);
app.post(
  '/sendMail',
  verifyToken,
  sendCommentNotification.sendCommentNotification
);
app.post('/get_comment', verifyToken, getComment.getComment);
app.get('/project_prof/:email_id', verifyToken, showProjects.showProjects);
app.post('/summary_comment', verifyToken, addSummaryComment.addSummaryComment);
app.post(
  '/get_summary_comment',
  verifyToken,
  getSummaryComment.getSummaryComment
);
app.post('/updated_add_fund', verifyToken, updatedAddFund.updatedAddFund);
app.post('/del_row', verifyToken, delrow.delrow);
app.post('/edit_sanctioned', verifyToken, editSanctioned.editSanctioned);
app.post('/del_user', verifyToken, delUser.delUser);
app.post('/del_project', verifyToken, delProject.delProject);
app.post('/to_actual', verifyToken, ToActual.ToActual);

app.get('/health', (req, res) => {
  res.send('SERVER UP');
});

app.listen(PORT, function () {
  console.log('Listening ');
});
