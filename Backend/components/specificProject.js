var express = require('express');
var router = express.Router();
const pool = require("./db");

// to get a specific project 

router.get("/project/:id",async function(req,res){

    try{

        var query = "SELECT * FROM projects WHERE project_title LIKE '%"
        query = query.concat(req.params.id)
        query = query.concat("%' ")
        //running the select command

        const db_res = await pool.query(query);

        var temp_json = db_res.rows;
            
            console.log(temp_json.length);

            for (let step = 0; step < temp_json.length; step++) {
                
                temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
            }

        console.log(temp_json)

        //returning all the rows
        res.json(temp_json);
        
    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;