var express = require('express');
var router = express.Router();
const pool = require('./db');

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const MAIL_CLIENT_ID = process.env.MAIL_CLIENT_ID;
const MAIL_CLIENT_SECRET = process.env.MAIL_CLIENT_SECRET;
const MAIL_REDIRECT_URI = process.env.MAIL_REDIRECT_URI;
const MAIL_REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN });

async function sendMail(req, res) {
  try {
    // this will extract the neccessary row from the users table
    const db_res = await pool.query(
      ' SELECT * from users WHERE email_id = $1 ',
      [req.params.email]
    );

    if (db_res.rows[0] == undefined) {
      // if the user himself is not valid then send -1
      res.json(-1);
    } else {
      // this will send 1 if the current user is an admin , or it will send 0
      res.json(db_res.rows[0].admin);
    }
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { sendMail: sendMail };
