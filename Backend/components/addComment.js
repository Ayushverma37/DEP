var express = require('express');
var router = express.Router();
const pool = require("./db");

async function addComment(req,res){

    try{
        
        // adding a comment for a particular project.
        
        var query = "INSERT INTO "
        query = query.concat(req.body.project_id);
        query=query.concat("_comment_table VALUES ($1,$2,$3,current_timestamp,'NO')");
        const db_res = await pool.query(query,[req.body.row_no,req.body.comment_body,req.body.prof_email]);

        // now updating the row of main table where the comment has been made ,setting the comm_flag to 1 
        if(req.body.is_admin == 2)
        {
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query = query.concat("_main_table set comm_flag = 1 where sr = ")
            query = query.concat(req.body.row_no);
            var temp_db = await pool.query(query);
        }
        


        const db_res2 = await pool.query("UPDATE projects set comment_time = current_timestamp where project_id = $1",[req.body.project_id]);

        var db_res4 = await pool.query("SELECT professor_list from projects where project_id = $1",[req.body.project_id]);

        var professors = db_res4.rows[0].professor_list;
        var prof_emails =professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");


            var prof_id = prof_emails[i].substring(0,index);
            prof_id=prof_id.replace(".","dot");
            console.log(prof_id)
            var query = "UPDATE "
            query=query.concat(prof_id)
            query=query.concat("_proj_list SET comment_time = current_timestamp where project_id = $1");
            var db_res6 = await pool.query(query,[req.body.project_id]);            

        }

        //returning 1 to status 
        res.json(1);
        
    }catch(error){
        console.error(error.message);
    }

// addding a comment
}

module.exports = {addComment:addComment}