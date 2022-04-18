var express = require('express');
var router = express.Router();
const pool = require("./db");


// addding a comment
router.post("/summary_comment",async function(req,res){

    try{

        
        // adding a comment for a particular project.
        
        var query = "INSERT INTO "
        query = query.concat(req.body.project_id);
        query=query.concat("_summary_comment_table VALUES ($1,$2,$3,current_timestamp,'NO')");
        const db_res = await pool.query(query,[req.body.row_no,req.body.comment_body,req.body.prof_email]);


        const db_res2 = await pool.query("UPDATE projects set comment_time = current_timestamp where project_id = $1",[req.body.project_id]);

        var db_res4 = await pool.query("SELECT professor_list from projects where project_id = $1",[req.body.project_id]);

        var professors = db_res4.rows[0].professor_list;
        var prof_emails =professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");

            var prof_id = prof_emails[i].substring(0,index);
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
}
);

module.exports = router;