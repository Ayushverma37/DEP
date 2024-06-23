const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require('./db');

// to get a specific project
async function delProject(req, res) {
  try {
    // now corresponding to each professor we need to make an entry in his corresponding project table
    var prof_emails = req.body.professors.split(',');

    for (var i in prof_emails) {
      // extracting the email before @
      var index = prof_emails[i].indexOf('@');

      var prof_id = prof_emails[i].substring(0, index);

      // checking whether the prof exists as a user or not

      var query = "SELECT count(*) FROM users where email_id = '";
      query = query.concat(prof_emails[i]);
      query = query.concat("' ");
      var db_temp_res = await pool.query(query);

      if (parseInt(db_temp_res.rows[0].count) == 0) {
        continue;
      }

      query = 'DELETE FROM ';
      prof_id = prof_id.replace('.', 'dot');
      query = query.concat(prof_id);
      query = query.concat("_proj_list where project_id = '");
      query = query.concat(req.body.p_id);
      query = query.concat("'");
      var db_res2 = await pool.query(query);
    }

    query = "DELETE FROM projects where project_id = '";
    query = query.concat(req.body.p_id);
    query = query.concat("'");

    var db_res = await pool.query(query);

    query = 'DROP TABLE ';
    query = query.concat(req.body.p_id);
    query = query.concat('_comment_table ');

    db_res = await pool.query(query);

    query = 'DROP TABLE ';
    query = query.concat(req.body.p_id);
    query = query.concat('_main_table ');

    db_res = await pool.query(query);

    query = 'DROP TABLE ';
    query = query.concat(req.body.p_id);
    query = query.concat('_summary_comment_table ');

    db_res = await pool.query(query);

    query = 'DROP TABLE ';
    query = query.concat(req.body.p_id);
    query = query.concat('_summary_table ');

    db_res = await pool.query(query);
    res.json(1);
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { delProject: delProject };
