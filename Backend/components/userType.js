var express = require('express');
var router = express.Router();

const pool = require("./db");

// to get the type of the user
async function userType(req,res){
    try{

        console.log(req.params.email);

        // this will extract the neccessary row from the users table 
        const db_res = await pool.query(" SELECT * from users WHERE email_id = $1 ",[req.params.email]);
        
        //console.log(db_res.rows[0].email_id);

        if(db_res.rows[0]==undefined)
        {
            // if the user himself is not valid then send -1
            res.json(-1);    
        }
        else
        {
            
            console.log(db_res.rows[0]);
            // this will send 1 if the current user is an admin , or it will send 0
            res.json(db_res.rows[0].admin);            
        }
        
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {userType:userType};