var express = require('express');
var router = express.Router();
const pool = require("./db");

// to get a specific project 

router.post("/project_search",async function(req,res){

    try{

        if(req.body.admin == 1)
        {
            var query = "";
            if(req.body.type == 1)
            {
                query = "SELECT * FROM projects WHERE project_title LIKE '%"
                query = query.concat(req.body.title)
                query = query.concat("%' ")
            }
            else if(req.body.type == 2)
            {   
                query = "SELECT * FROM projects WHERE project_id LIKE '%"
                query = query.concat(req.body.id)
                query = query.concat("%' ")
            }
            else if(req.body.type == 3)
            {
                query = "SELECT * FROM projects WHERE pi LIKE '%"
                query = query.concat(req.body.pi)
                query = query.concat("%' ")
            }
            else if(req.body.type == 4)
            {
                query = "SELECT * FROM projects WHERE dept LIKE '%"
                query = query.concat(req.body.dept)
                query = query.concat("%' ")
            }
            else if(req.body.type == 5)
            {
                query = "SELECT * FROM projects WHERE start_year LIKE '%"
                query = query.concat(req.body.year)
                query = query.concat("%' ")
            }
            else if(req.body.type == 6)
            {
                query = "SELECT * FROM projects WHERE fund_agency LIKE '%"
                query = query.concat(req.body.fund_agency)
                query = query.concat("%' ")
            }
            
            //running the select command

            var db_res = await pool.query(query);




            var temp_json = db_res.rows;
                
                console.log(temp_json.length);

                for (let step = 0; step < temp_json.length; step++) {
                    
                    temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
                }

            console.log(temp_json)

            //returning all the rows
            res.json(temp_json);
        }
        else if(req.body.admin == 0)
        {

            var index = req.params.email_id.indexOf("@");

            var prof_id = req.params.email_id.substring(0,index);
            
            var query = "";
            if(req.body.type == 1)
            {
                query = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE project_title LIKE '%")
                query = query.concat(req.body.title)
                query = query.concat("%' ")
            }
            else if(req.body.type == 2)
            {   
                query = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE project_id LIKE '%")
                query = query.concat(req.body.id)
                query = query.concat("%' ")
            }
            else if(req.body.type == 3)
            {
                query = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE pi LIKE '%")
                query = query.concat(req.body.pi)
                query = query.concat("%' ")
            }
            else if(req.body.type == 4)
            {
                qquery = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE dept LIKE '%")
                query = query.concat(req.body.dept)
                query = query.concat("%' ")
            }
            else if(req.body.type == 5)
            {
                query = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE start_year LIKE '%")
                query = query.concat(req.body.year)
                query = query.concat("%' ")
            }
            else if(req.body.type == 6)
            {
                query = "SELECT * FROM "
                query = query.concat(prof_id)
                query = query.concat("_proj_list WHERE fund_agency LIKE '%")
                query = query.concat(req.body.fund_agency)
                query = query.concat("%' ")
            }
            
            //running the select command

            var db_res = await pool.query(query);




            var temp_json = db_res.rows;
                
                console.log(temp_json.length);

                for (let step = 0; step < temp_json.length; step++) {
                    
                    temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
                }

            console.log(temp_json)

            //returning all the rows
            res.json(temp_json);
        }
        
        
    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;