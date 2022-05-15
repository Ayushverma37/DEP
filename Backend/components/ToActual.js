const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require("./db");


router.post("/to_actual",async function(req,res){

    try{

        var query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table where sr = ")
        query = query.concat(req.body.sr)
        query = query.concat(" set payment = ")
        query = query.concat(req.body.new_pay )
        var db_res = await pool.query(query);

        var query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table where sr = ")
        query = query.concat(req.body.sr)
        query = query.concat(" set actual_flag = 0")
        var db_res = await pool.query(query);

        query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table where sr >= ")
        query = query.concat(req.body.sr)
        query = query.concat(" set balance = balance - ")
        query = query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay))
        db_res = await pool.query(query);

        query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_summary_table where heads = '")
        query = query.concat(req.body.heads)
        query = query.concat("' set expenditure = expenditure + ")
        query = query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay))
        db_res = await pool.query(query);

        if(req.body.heads == 'Equipments'){
            // this is non recurring 
            // updating the balance of non recurring
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set balance = balance - ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Non-Rec.' ");
            
            db_res = await pool.query(query);

            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set expenditure = expenditure + ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Non-Rec.' ");

            db_res = await pool.query(query);

        }
        else 
        {
            // now updating the recurring balance in case heads is not equipments
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set balance = balance - ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Rec.' ");

            db_res = await pool.query(query);

            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set expenditure = expenditure + ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Rec.' ");

            db_res = await pool.query(query);
        }
        


    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;