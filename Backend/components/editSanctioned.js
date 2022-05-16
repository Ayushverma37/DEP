var express = require('express');
var router = express.Router();
const pool = require("./db");


// to get the details of main table of a project 

async function editSanctioned(req,res){

    try{

        //getting the details from the project (main) table 
        var query = "UPDATE "
        query = query.concat(req.body.project_id)
        query=query.concat("_summary_table set sanctioned_amount =");
        query=query.concat(req.body.sanc)
        query=query.concat(" where heads = '")
        query=query.concat(req.body.heads)
        query=query.concat("'")
        console.log(query);
        const db_res = await pool.query(query);

        //returning all the rows received from the table


        res.json(1);

        
    }catch(error){
        console.error(error.message);
    }

}


module.exports = {editSanctioned:editSanctioned};