var express = require('express');
var router = express.Router();
const pool = require("./db");


// to give projects on profs dashboard
async function showProjects(req,res){

    try{

        var index = req.params.email_id.indexOf("@");

        var prof_id = req.params.email_id.substring(0,index);
        prof_id=prof_id.replace(".","dot");
        console.log(prof_id)
        //running the select command
        var query = "SELECT * from "
        query=query.concat(prof_id)
        query=query.concat("_proj_list order by comment_time desc")
        var db_res = await pool.query(query);


        var temp_json = db_res.rows;

        for (let step = 0; step < temp_json.length; step++) {
                
            temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
            // extracting names of professors and returning that as well
            var prof_emails = temp_json[step].professor_list.split(',');
            var to_ret = ""
            for (var i in prof_emails) {
                // extracting the user names 
                db_res = await pool.query("SELECT * FROM users where email_id = $1", [prof_emails[i]]);

                to_ret = to_ret.concat(" ");
                to_ret = to_ret.concat(db_res.rows[0].user_name);
            }
            temp_json[step].names = to_ret;
        }
        
        console.log(temp_json);

        //returning all the rows
        res.json(temp_json);


        //returning all the rows
        //res.json(db_res.rows);
        
    }catch(error){
        console.error(error.message);
    }

}

module.exports = {showProjects:showProjects};