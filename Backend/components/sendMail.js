var express = require('express');
var router = express.Router();
const pool = require("./db");

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1059125586728-nkmia5q7kg94m15kdik2v49ouqs3va50.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN ='1//048GqWsVgBBrgCgYIARAAGAQSNwF-L9IrRMy77f-TwqYJU_xvOVwZ9N0E52K0bMpXC-DiZto8Zdw9CDP6SBCUHWIMGx6WusW9fhE';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(req,res){
  try{

      console.log(req.params.email);

      // this will extract the neccessary row from the users table 
      const db_res = await pool.query(" SELECT * from users WHERE email_id = $1 ",[req.params.email]);
      
      //console.log(db_res.rows[0].email_id);

      if(db_res.rows[0]==undefined)
      {
          // if the user himself is not valid then send -1
          res.json(-1);    
      }
      else
      {
          
          console.log(db_res.rows[0]);
          // this will send 1 if the current user is an admin , or it will send 0
          res.json(db_res.rows[0].admin);            
      }
      
  } catch (error) {
      console.error(error.message);
  }
}



module.exports = {sendMail:sendMail};