var express = require('express');
var router = express.Router();
const pool = require("./db");

const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '1059125586728-nkmia5q7kg94m15kdik2v49ouqs3va50.apps.googleusercontent.com';
const CLEINT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
// const REFRESH_TOKEN = '1//04pSBd1ygj2oFCgYIARAAGAQSNwF-L9Ir23wd9yp_4srOfXowY8weN5wT4DozLO1qDABDBgQCvdaX2oocH4IGLelgqtwbRsz8LiA';
const REFRESH_TOKEN = '1//042y9WpUOfcEiCgYIARAAGAQSNwF-L9Irp8O5WX4zU6VKuqVew7DgGNir6D_n6aDpJCR5sQNoW0aW_ztO8-W7ONfPDwhD7Nb0qqU'

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

router.post("/sendMail",async function(req,res){
    var db_res1 = await pool.query("SELECT professor_list from projects where project_id = $1",[req.body.project_id]);
    var professors = db_res1.rows[0].professor_list;
    var prof_emails =professors.split(',');
    var senderAddresses = [];
    let prof_length = prof_emails.length;
    for (let i = 0; i < prof_length; i++) {
        if(prof_emails[i]!=req.body.prof_email)
        {
            senderAddresses.push(prof_emails[i]);
        }
    }

    var db_res2 = await pool.query("SELECT email_id from users WHERE admin = '1'");
    var admins = db_res2.rows[0].email_id;
    var admin_emails =admins.split(',');
    let admin_length = admin_emails.length;
    for (let i = 0; i < admin_length; i++) {
            if(admin_emails[i]!=req.body.prof_email)
            {
              senderAddresses.push(admin_emails[i]);
            }   
    }
    console.log(senderAddresses);
    async function sendMail() {
        try {
          const accessToken = await oAuth2Client.getAccessToken();
      
          const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'researchmanagementiitrpr@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLEINT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            },
          });
          var subject_ = req.body.prof_name + ' commented on ' + req.body.project_id;
          const mailOptions = {
            from: 'Research Management <researchmanagementiitrpr@gmail.com>',
            to: senderAddresses,
            subject: subject_,
            html: req.body.comment_body
          };
      
          const result = await transport.sendMail(mailOptions);
          return result;
        } catch (error) {
          return error;
        }
      }
      sendMail()
        .then((result) => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));
}
);

module.exports = router;