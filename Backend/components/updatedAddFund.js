var express = require('express');
var router = express.Router();
const pool = require("./db");



// now to add a fund
async function updatedAddFund(req,res){

    try{

        

        // first extracting the total of all the years 

        var query = "SELECT * from "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table WHERE heads = 'Total' ");
        
        var db_res = await pool.query(query);

        

        var feilds_arr = ["'Rec.'","'Non-Rec.'"]
        var val_arr = [Number(req.body.recur),Number(req.body.non_recur)]

        if(db_res.rows[0].year_1_funds == 0 ){
            
            var total = 0;
            for (let step = 0; step < 2; step++) {
                // updating the rows
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("year_1_funds =  ");
                query2 = query2.concat(val_arr[step]);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2);
                deb_res = await pool.query(query2);
                total = total + val_arr[step]; 
                
                // updating total balance 
                query2 = "SELECT * from "
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table WHERE heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2)
                db_res = await pool.query(query2);
                var to_update = val_arr[step]+db_res.rows[0].balance;
                
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("balance =  ");
                query2 = query2.concat(to_update);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2);
                deb_res = await pool.query(query2);

            }
            var query2 = "UPDATE ";
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table set ")
            query2 = query2.concat("year_1_funds =  ");
            query2 = query2.concat(total);
            query2 = query2.concat(" where heads = 'Total'")
            console.log(query2);
            deb_res = await pool.query(query2);

        }
        else if (db_res.rows[0].year_2_funds == 0){
            var total = 0;
            for (let step = 0; step < 2; step++) {
                // updating the rows
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("year_2_funds =  ");
                query2 = query2.concat(val_arr[step]);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                deb_res = await pool.query(query2);
                total = total + val_arr[step];
                
                // updating total balance 
                query2 = "SELECT * from "
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table WHERE heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2)
                db_res = await pool.query(query2);
                var to_update = val_arr[step]+db_res.rows[0].balance;
                
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("balance =  ");
                query2 = query2.concat(to_update);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2);
                deb_res = await pool.query(query2);
                    
            }
            var query2 = "UPDATE ";
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table set ")
            query2 = query2.concat("year_2_funds =  ");
            query2 = query2.concat(total);
            query2 = query2.concat(" where heads = 'Total'")
            console.log(query2);
            deb_res = await pool.query(query2);
        }
        else if(db_res.rows[0].year_3_funds == 0){
            var total = 0;
            for (let step = 0; step < 2; step++) {
                // updating the rows
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("year_3_funds =  ");
                query2 = query2.concat(val_arr[step]);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                deb_res = await pool.query(query2);

                total = total + val_arr[step]; 
                // updating total balance 
                query2 = "SELECT * from "
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table WHERE heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2)
                db_res = await pool.query(query2);
                var to_update = val_arr[step]+db_res.rows[0].balance;
                
                var query2 = "UPDATE ";
                query2 = query2.concat(req.body.project_id)
                query2 = query2.concat("_summary_table set ")
                query2 = query2.concat("balance =  ");
                query2 = query2.concat(to_update);
                query2 = query2.concat(" where heads = ")
                query2 = query2.concat(feilds_arr[step]);
                console.log(query2);
                deb_res = await pool.query(query2);
                    
            }
            var query2 = "UPDATE ";
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table set ")
            query2 = query2.concat("year_3_funds =  ");
            query2 = query2.concat(total);
            query2 = query2.concat(" where heads = 'Total'")
            console.log(query2);
            deb_res = await pool.query(query2);
        }

        var total = 0;
        for (let step = 0; step < 2; step++) {
            // updating total balance 
            query2 = "SELECT * from "
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table WHERE heads = ")
            query2 = query2.concat(feilds_arr[step]);
            console.log(query2)
            db_res = await pool.query(query2);
            var total = total + db_res.rows[0].balance;

        }
        var query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("balance =  ");
        query2 = query2.concat(total);
        query2 = query2.concat(" where heads = 'Total'")
        console.log(query2);
        deb_res = await pool.query(query2);


        // inserting row in expenditure table 
        //inserting details in the project (main) table 
        var query2 = "SELECT COUNT(*) FROM "
        query2 = query2.concat(req.body.project_id)
        query2=query2.concat("_main_table")
        var deb_res2 = await pool.query(query2);

        var cnt= parseInt(deb_res2.rows[0].count)+1;

        console.log(cnt)

        // finally updating the expenditure table 
        var query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table VALUES ($1,$2,$3,$4,$5,NULL,$6,$7,0)");
        db_res = await pool.query(query,[cnt,req.body.particulars,req.body.remarks,req.body.vouchno,Number(req.body.recur)+Number(req.body.non_recur),total,"Grant"]);

        //returning 1 since everything was a success 
        res.json(1);
        


    }catch(error){
        console.error(error.message);
    }

}


module.exports = {updatedAddFund:updatedAddFund};