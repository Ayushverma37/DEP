var express = require('express');
var router = express.Router();
const pool = require("./db");


// to get the details of main table of a project 
async function getMainTable(req,res){

    try{

        //getting the details from the project (main) table 
        var query = "SELECT * from "
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table order by sr asc");
        const db_res = await pool.query(query);

        //returning all the rows received from the table

        temp_res = db_res.rows;

        res.json(db_res.rows);

        
    }catch(error){
        console.error(error.message);
    }

}


module.exports = {getMainTable:getMainTable};
