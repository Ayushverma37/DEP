var express = require('express');
var router = express.Router();
const pool = require("./db");

async function createProject(req,res){

    try {



        var sum_rec = parseInt(req.body.rec_sanctioned_amount) + parseInt(req.body.nonrec_sanctioned_amount);
        console.log(sum_rec);
        if(sum_rec != parseInt(req.body.grant))
        {
            res.json(-1)
        }
        else
        {
            var rec_total = parseInt(req.body.man_sanc) + parseInt(req.body.cons_sanc) + parseInt(req.body.travel_sanc) + parseInt(req.body.testing_sanc) + parseInt(req.body.overhead_sanc) + parseInt(req.body.unforseen_sanc) + parseInt(req.body.fab_sanc);
            var non_rec_total = parseInt(req.body.const_sanc) + parseInt(req.body.equip_sanc);
            console.log(rec_total);
            console.log("Consumables"+req.body.testing_sanc);
            console.log(non_rec_total);
            if( rec_total > parseInt(req.body.rec_sanctioned_amount) || non_rec_total > parseInt(req.body.nonrec_sanctioned_amount) )
            {
                res.json(-2)
            }
            else 
            {
                    // the data we get from request , just printing it 
                console.log(req.body);

                // running the insert command 
                var db_res = await pool.query(" INSERT INTO projects VALUES ($1,$2,$3,$4,current_timestamp,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING * ",[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant,req.body.pi,req.body.co_pi,req.body.dept,req.body.fund_agency,req.body.sanc_order_no,req.body.sanctioned_date,req.body.duration,req.body.dos,req.body.doc,req.body.start_year]);
                
                // now corresponding to each professor we need to make an entry in his corresponding project table 
                var prof_emails = req.body.professors.split(',');

                for(var i in prof_emails)
                {
                    // extracting the email before @
                    var index = prof_emails[i].indexOf("@");

                    var prof_id = prof_emails[i].substring(0,index);
                    prof_id=prof_id.replace(".","dot");
                    console.log(prof_id)
                    var query = "INSERT INTO "
                    query=query.concat(prof_id)
                    query=query.concat("_proj_list VALUES ($1,$2,$3,$4,current_timestamp,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)");
                    db_res = await pool.query(query,[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant,req.body.pi,req.body.co_pi,req.body.dept,req.body.fund_agency,req.body.sanc_order_no,req.body.sanctioned_date,req.body.duration,req.body.dos,req.body.doc,req.body.start_year]);            

                }

                // also we need to make 2 seperate tables for each project(the summary table and the main one )

                // creating the main_table:-
                var query="CREATE TABLE ";
                query=query.concat(req.body.project_id)
                query=query.concat("_main_table (sr int , particulars text , remarks text ,vouchNo text, rec text , payment int , balance int , heads text , comm_flag int , actual_flag int) ")
                deb_res = await pool.query(query)

                // creating the comments table 
                query = "CREATE TABLE "
                query = query.concat(req.body.project_id)
                query = query.concat("_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")
                deb_res = await pool.query(query)
                

                // creating the sumarry table
                query="CREATE TABLE ";
                query=query.concat(req.body.project_id)
                query=query.concat("_summary_table (sr int , heads text , sanctioned_amount int ,year_1_funds int,year_2_funds int , year_3_funds int ,expenditure int , balance int , comm_flag int) ")
                deb_res = await pool.query(query)

                // creating the comment table for the summary table
                query = "CREATE TABLE "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")

                deb_res = await pool.query(query)

                // now inserting the initial rows in the table 
                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (3,'Manpower',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.man_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (4,'Consumables',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.cons_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (5,'Travel',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.travel_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (6,'Field Testing/Demo/Tranings',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.testing_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (7,'Overheads',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.overhead_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (8,'Unforseen Expenses',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.unforseen_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (9,'Equipments',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.equip_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (10,'Construction',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.const_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (11,'Fabrication',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.fab_sanc])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (12,'Misc Rec.',10000000,0,0,0,0,0,0)");
                deb_res = await pool.query(query)

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (13,'Misc Non Rec.',10000000,0,0,0,0,0,0)");
                deb_res = await pool.query(query)

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (1,'Rec.',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.rec_sanctioned_amount])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (2,'Non-Rec.',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.nonrec_sanctioned_amount])

                query = "INSERT INTO "
                query = query.concat(req.body.project_id)
                query = query.concat("_summary_table VALUES (14,'Total',$1,0,0,0,0,0,0)");
                deb_res = await pool.query(query,[req.body.grant])

                //returning 1 since everything was a success 
                res.json(1);
            }

            
        }


       
    
    } catch (error) {
        console.error(error.message);
    }

}
module.exports = {createProject:createProject}