var express = require('express');
var router = express.Router();
const pool = require("./db");

// to create a new project
router.post("/create_project",async function(req,res){

    try {
        // the data we get from request , just printing it 
        console.log(req.body);

        // running the insert command 
        var db_res = await pool.query(" INSERT INTO projects VALUES ($1,$2,$3,$4,current_timestamp) RETURNING * ",[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant]);
        
        // now corresponding to each professor we need to make an entry in his corresponding project table 
        var prof_emails = req.body.professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");

            var prof_id = prof_emails[i].substring(0,index);
            console.log(prof_id)
            var query = "INSERT INTO "
            query=query.concat(prof_id)
            query=query.concat("_proj_list VALUES ($1,$2,$3,$4,current_timestamp)");
            db_res = await pool.query(query,[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant]);            

        }

        // also we need to make 2 seperate tables for each project(the summary table and the main one )

        // creating the main_table:-
        var query="CREATE TABLE ";
        query=query.concat(req.body.project_id)
        query=query.concat("_main_table (sr int , particulars text , remarks text ,vouchNo text, rec text , payment int , balance int , heads text) ")
        deb_res = await pool.query(query)

        // creating the comments table 
        query = "CREATE TABLE "
        query = query.concat(req.body.project_id)
        query = query.concat("_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")
        deb_res = await pool.query(query)
        

        // creating the sumarry table
        query="CREATE TABLE ";
        query=query.concat(req.body.project_id)
        query=query.concat("_summary_table (sr int , heads text , sanctioned_amount int ,year_1_funds int,year_2_funds int , year_3_funds int ,expenditure int , balance int) ")
        deb_res = await pool.query(query)

        // creating the comment table for the summary table
        query = "CREATE TABLE "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")

        deb_res = await pool.query(query)

        // now inserting the initial rows in the table 
        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (3,'Manpower',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (4,'Consumables',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (5,'Travel',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (6,'Field Testing/Demo/Tranings',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (7,'Overheads',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (8,'Unforseen Expenses',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (9,'Equipments',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (10,'Construction',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (11,'Fabrication',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (12,'Misc Rec.',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (13,'Misc Non Rec.',0,0,0,0,0,0)");
        deb_res = await pool.query(query)

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (1,'Rec.',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.rec_sanctioned_amount])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (2,'Non-Rec.',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.nonrec_sanctioned_amount])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (14,'Total',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.grant])

        //returning 1 since everything was a success 
        res.json(1);
    
    } catch (error) {
        console.error(error.message);
    }

})


module.exports = router;