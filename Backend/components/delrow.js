var express = require('express');
var router = express.Router();
const pool = require("./db");


// to delete a particular row
router.post("/del_row",async function(req,res){

    try{
        console.log("REQ");

        // extracting the content via the select query
        var query = "SELECT * FROM ";
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table where sr = ");
        query=query.concat(req.body.sr);

        
        var db_res = await pool.query(query);
        

        // extracting the balance and sr_no 
        var sr_no = db_res.rows[0].sr;
        var bal = db_res.rows[0].balance;
        var pay = db_res.rows[0].payment;

        // delete the row corresponding to this serial number
        query = "DELETE FROM ";
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table where sr = ");
        query=query.concat(req.body.sr);

        db_res = await pool.query(query);

        // now update all other rows' balance 

        query = "UPDATE ";
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table set balance = balance + ");
        query=query.concat(pay)
        query = query.concat(" where sr > ");
        query=query.concat(req.body.sr);

        db_res = await pool.query(query);


        // update all other rows serial number

        query = "UPDATE ";
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table set sr = sr - 1");
        query = query.concat(" where sr > ");
        query=query.concat(req.body.sr);

        db_res = await pool.query(query);

        // now updating the summary table : - 
        
        // subtracting the payment from expenditure 
        query = "UPDATE ";
        query = query.concat(req.body.project_id)
        query=query.concat("_summary_table set expenditure = expenditure - ");
        query=query.concat(pay);
        query = query.concat(" where heads = '");
        query = query.concat(req.body.heads);
        query = query.concat("'");

        db_res = await pool.query(query);

        if(req.body.heads == 'Equipments'){
            // this is non recurring 
            // updating the balance of non recurring
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set balance = balance + ");
            query=query.concat(pay);
            query = query.concat(" where heads = 'Non-Rec.' ");
            
            db_res = await pool.query(query);

            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set expenditure = expenditure - ");
            query=query.concat(pay);
            query = query.concat(" where heads = 'Non-Rec.' ");

            db_res = await pool.query(query);

        }
        else 
        {
            // now updating the recurring balance in case heads is not equipments
            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set balance = balance + ");
            query=query.concat(pay);
            query = query.concat(" where heads = 'Rec.' ");

            db_res = await pool.query(query);

            query = "UPDATE ";
            query = query.concat(req.body.project_id)
            query=query.concat("_summary_table set expenditure = expenditure - ");
            query=query.concat(pay);
            query = query.concat(" where heads = 'Rec.' ");

            db_res = await pool.query(query);
        }
        
        res.json(1);

    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;