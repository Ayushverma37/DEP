var express = require('express');
var router = express.Router();

const pool = require("./db");

// to add a user 
router.post("/user",async function(req,res){
    try {
        // the data we get from request , just printing it 
        console.log(req.body);

        // running the insert command 
        const db_res = await pool.query(" INSERT INTO users VALUES ($1,$2,$3) RETURNING * ",[req.body.email_id,req.body.name,req.body.admin]);
        
        // creating a table for this prof:-
        if(req.body.admin==2){
            // first extracting the entry number
            var email = req.body.new_email_id;
            var index = email.indexOf("@")
            var str_query = "CREATE TABLE ";
            str_query=str_query.concat(email.substring(0,index));
            str_query= str_query.concat("_proj_list");
            str_query=str_query.concat(" (project_id text, project_title text, professor_list text, project_grant integer, comment_time timestamp with time zone, pi text, co_pi text, dept text, fund_agency text, sanc_order_no text, sanctioned_date text, duration text, dos text, doc text, start_year text)");
            console.log(str_query);
            const db_res2= await pool.query(str_query)
        }        

        var db_res3 = await pool.query("SELECT * from users");
        //returning all the row that were inserted
        res.json(db_res3.rows);
    
    } catch (error) {
        console.error(error.message);
    }
})

module.exports = router;