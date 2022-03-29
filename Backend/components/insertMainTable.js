var express = require('express');
var router = express.Router();
const pool = require("./db");


// to insert into a main table of a project 

router.post("/insert_main_table",async function(req,res){

    try{

        //inserting details in the project (main) table 
        var query2 = "SELECT COUNT(*) FROM "
        query2 = query2.concat(req.body.project_id)
        query2=query2.concat("_main_table")
        var deb_res2 = await pool.query(query2);

        var cnt= parseInt(deb_res2.rows[0].count)+1;

        console.log(cnt)

        // adding expenditure and updating the summarrya table balance and expenditure cols
        query2 = "SELECT * from  ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table ")
        query2 = query2.concat(" where heads = $1")
        console.log(query2);
        console.log(req.body.heads);
        deb_res2 = await pool.query(query2,[req.body.heads]);
        
        var temp_balance = deb_res2.rows[0].balance - req.body.pay;
        var temp_expenditure = deb_res2.rows[0].expenditure+req.body.pay;

        // updating the balance 
        query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("balance =  ");
        query2 = query2.concat(temp_balance);
        query2 = query2.concat(" where heads = '")
        query2 = query2.concat(req.body.heads)
        query2 = query2.concat("'");
        console.log(query2);
        deb_res2 = await pool.query(query2);

        // updating the expenditure 
        query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("expenditure =  ");
        query2 = query2.concat(temp_expenditure);
        query2 = query2.concat(" where heads = '")
        query2 = query2.concat(req.body.heads)
        query2 = query2.concat("'");
        console.log(query2);
        deb_res2 = await pool.query(query2);

        // now updating the total balance and expenditure
        var feilds_arr = ["'Manpower'","'Consumables'","'Travel'","'Field Testing/Demo/Tranings'","'Overheads'","'Unforseen Expenses'","'Equipments'","'Construction'","'Fabrication'"]


        var total_bal = 0;
        var total_exp=0;
        for (let step = 0; step < 9; step++) {
            // updating total balance 
            query2 = "SELECT * from "
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table WHERE heads = ")
            query2 = query2.concat(feilds_arr[step]);
            console.log(query2)
            db_res2 = await pool.query(query2);
            var total_bal = total_bal + db_res2.rows[0].balance;
            var total_exp = total_exp + db_res2.rows[0].expenditure;

        }
        var query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("balance =  ");
        query2 = query2.concat(total_bal);
        query2 = query2.concat(" where heads = 'Total'")
        console.log(query2);
        await pool.query(query2);

        // updating balance col
        query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("balance =  ");
        query2 = query2.concat(total_bal);
        query2 = query2.concat(" where heads = 'Total'")
        console.log(query2);
        await pool.query(query2);

        // updating expenditure col 
        query2 = "UPDATE ";
        query2 = query2.concat(req.body.project_id)
        query2 = query2.concat("_summary_table set ")
        query2 = query2.concat("expenditure =  ");
        query2 = query2.concat(total_exp);
        query2 = query2.concat(" where heads = 'Total'")
        console.log(query2);
        await pool.query(query2);

        // finally updating the expenditure table 
        var query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table VALUES ($1,$2,$3,$4,$5,$6,$7,$8)");
        const db_res = await pool.query(query,[cnt,req.body.particulars,req.body.remarks,req.body.vouchno,req.body.rec,req.body.pay,total_bal,req.body.heads]);


        //returning 1 if the operation was successfull.
        res.json(1);
        
    }catch(error){
        console.error(error.message);
    }

});

module.exports = router;