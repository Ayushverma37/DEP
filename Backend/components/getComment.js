var express = require('express');
var router = express.Router();
const pool = require("./db");



// to get a comment
async function getComment(req,res){

    try{

        // adding a comment for a particular project.
        var query ="SELECT * FROM "
        query=query.concat(req.body.project_id);
        query = query.concat("_comment_table where sr=$1 order by comment_time desc")
        const db_res = await pool.query(query,[req.body.row_no]);

        var temp_json = db_res.rows;

        // now updating the row of main table where the comment has been made ,setting the comm_flag to 0
        if(req.body.is_admin == 1)
        {
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query = query.concat("_main_table set comm_flag = 0 where sr = ")
            query = query.concat(req.body.row_no);
            var temp_db = await pool.query(query);
        }


        for (let step = 0; step < temp_json.length; step++) {
                
            temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
        }
        
        console.log(temp_json);

        //returning all the rows
        res.json(temp_json);
        
    }catch(error){
        console.error(error.message);
    }
}

module.exports = {getComment:getComment}