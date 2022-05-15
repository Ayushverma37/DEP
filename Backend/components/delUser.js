const { query } = require('express');
var express = require('express');
var router = express.Router();
const pool = require("./db");


router.post("/del_user",async function(req,res){

    try{


        var query = "DELETE FROM users where email_id = '"
        query = query.concat(req.body.e_id)
        query = query.concat("'")

        var db_res = await pool.query(query);
        
        
        var index = req.body.e_id.indexOf("@");

        var prof_id = req.body.e_id.substring(0,index);
        console.log(prof_id)

        query = "DROP TABLE "
        query = query.concat(prof_id)
        query = query.concat("_proj_list ");

        db_res = await pool.query(query);
        res.json(1);


    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;