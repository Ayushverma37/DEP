const express = require('express');
const router = express.Router();
const pool = require('./db');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// Environment variables
const {
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REDIRECT_URI,
  MAIL_REFRESH_TOKEN,
  MAIL_GMAIL_USER,
  DISABLE_MAIL_FOR_IIT_DOMAIN,
} = process.env;

// OAuth2 client setup
const oAuth2Client = new google.auth.OAuth2(
  MAIL_CLIENT_ID,
  MAIL_CLIENT_SECRET,
  MAIL_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: MAIL_REFRESH_TOKEN });

// Function to fetch professor emails
async function getProfessorEmails(projectId, profEmail) {
  const dbRes = await pool.query(
    'SELECT professor_list FROM projects WHERE project_id = $1',
    [projectId]
  );
  const professors = dbRes.rows[0].professor_list;
  const profEmails = professors.split(',').map((email) => email.trim());
  return profEmails.filter((email) => email !== profEmail);
}

// Function to fetch admin emails
async function getAdminEmails() {
  const dbRes = await pool.query(
    "SELECT email_id FROM users WHERE admin = '1'"
  );
  return dbRes.rows.map((row) => row.email_id.trim());
}

// Function to send email
async function sendMail(senderAddresses, subject, commentBody) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: MAIL_GMAIL_USER,
        clientId: MAIL_CLIENT_ID,
        clientSecret: MAIL_CLIENT_SECRET,
        refreshToken: MAIL_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `Research Management <${MAIL_GMAIL_USER}>`,
      to: senderAddresses.join(', '),
      subject: subject,
      html: commentBody,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw error;
  }
}

async function sendCommentNotification(req, res) {
  try {
    const { project_id, prof_email, prof_name, comment_body } = req.body;

    const profEmails = await getProfessorEmails(project_id, prof_email);
    const adminEmails = await getAdminEmails();

    var senderAddresses = [
      ...profEmails,
      ...adminEmails.filter((email) => !profEmails.includes(email)),
    ];

    // Filter out emails ending with @iitrpr.ac.in domain
    if (DISABLE_MAIL_FOR_IIT_DOMAIN) {
      senderAddresses = senderAddresses.filter(
        (email) => !email.endsWith('@iitrpr.ac.in')
      );
    }

    const subject = `${prof_name} commented on ${project_id}`;

    const result = await sendMail(senderAddresses, subject, comment_body);

    res.status(200).send('Email sent');
  } catch (error) {
    res.status(500).send('Error sending email');
  }
}

module.exports = { sendCommentNotification: sendCommentNotification };
