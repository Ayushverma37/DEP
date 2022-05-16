const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require("./db");


async function ToActual(req,res){

    try{
        console.log(req.body);
        var query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table ")
        query = query.concat(" set payment = ")
        query = query.concat(req.body.new_pay )
        query = query.concat(" where sr = ")
        query = query.concat(req.body.sr)
        
        var db_res = await pool.query(query);
        console.log(query);
        var query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table  set actual_flag = 0 where sr = ")
        query = query.concat(req.body.sr)
        var db_res = await pool.query(query);
        console.log(query);
        query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_main_table set balance = balance - ") 
        query = query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay))
        query = query.concat(" where sr >= ")
        query = query.concat(req.body.sr)
        
        db_res = await pool.query(query);
        console.log(query);
        query = "UPDATE "
        query = query.concat(req.body.p_id)
        query = query.concat("_summary_table set expenditure = expenditure + ")
        query = query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay))
        query = query.concat(" where heads = '")
        query = query.concat(req.body.heads)
        query = query.concat("' ")
        
        db_res = await pool.query(query);
        console.log(query);
        if(req.body.heads == 'Equipments' || req.body.heads == 'Construction' || req.body.heads == 'Misc Non Rec.'){
            // this is non recurring 
            // updating the balance of non recurring
            query = "UPDATE ";
            query = query.concat(req.body.p_id)
            query=query.concat("_summary_table set balance = balance - ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Non-Rec.' ");
            console.log(query);
            db_res = await pool.query(query);
            console.log(query);
            query = "UPDATE ";
            query = query.concat(req.body.p_id)
            query=query.concat("_summary_table set expenditure = expenditure + ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Non-Rec.' ");
            console.log(query);
            db_res = await pool.query(query);

        }
        else 
        {
            // now updating the recurring balance in case heads is not equipments
            query = "UPDATE ";
            query = query.concat(req.body.p_id)
            query=query.concat("_summary_table set balance = balance - ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Rec.' ");
            console.log(query);
            db_res = await pool.query(query);
            console.log(query);
            query = "UPDATE ";
            query = query.concat(req.body.p_id)
            query=query.concat("_summary_table set expenditure = expenditure + ");
            query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
            query = query.concat(" where heads = 'Rec.' ");
            console.log(query);
            db_res = await pool.query(query);
        }

        query = "UPDATE ";
        query = query.concat(req.body.p_id)
        query=query.concat("_summary_table set expenditure = expenditure + ");
        query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
        query = query.concat(" where heads = 'Total' ");
        console.log(query);
        db_res = await pool.query(query);

        query = "UPDATE ";
        query = query.concat(req.body.p_id)
        query=query.concat("_summary_table set balance = balance - ");
        query=query.concat(parseInt(req.body.new_pay) - parseInt(req.body.old_pay));
        query = query.concat(" where heads = 'Total' ");
        console.log(query);
        db_res = await pool.query(query);

        res.json(1);


    }catch(error){
        console.error(error.message);
    }

}

module.exports = {ToActual:ToActual};