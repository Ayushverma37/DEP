var express = require('express');
var router = express.Router();
const pool = require('./db');

// to insert into a main table of a project
async function insertMainTable(req, res) {
  try {
    //inserting details in the project (main) table
    var query2 = 'SELECT COUNT(*) FROM ';
    query2 = query2.concat(req.body.project_id);
    query2 = query2.concat('_main_table');
    var deb_res2 = await pool.query(query2);

    var cnt = parseInt(deb_res2.rows[0].count) + 1;

    //checking whether we can add this expenditure or not!

    query2 = 'SELECT * from  ';
    query2 = query2.concat(req.body.project_id);
    query2 = query2.concat('_summary_table ');
    query2 = query2.concat(' where heads = $1');

    deb_res2 = await pool.query(query2, [req.body.heads2]);

    var temp_expenditure = deb_res2.rows[0].expenditure + req.body.pay;
    var check_sanc = deb_res2.rows[0].sanctioned_amount;

    // in case the sanctioned amount is less than total current expenditure then return -1
    if (temp_expenditure > check_sanc) {
      res.json(-1);
    } else {
      // adding expenditure and updating the summarrya table balance and expenditure cols
      query2 = 'SELECT * from  ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table ');
      query2 = query2.concat(' where heads = $1');
      deb_res2 = await pool.query(query2, [req.body.heads]);

      var temp_balance = deb_res2.rows[0].balance - req.body.pay;
      // if the balance now available is less than 0 now

      /*if(temp_balance<0)
            {
                
                res.json(-1); 
            }*/
      var temp_expenditure = deb_res2.rows[0].expenditure + req.body.pay;

      // updating the balance of recurring or non recurring
      query2 = 'UPDATE ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table set ');
      query2 = query2.concat('balance =  ');
      query2 = query2.concat(temp_balance);
      query2 = query2.concat(" where heads = '");
      query2 = query2.concat(req.body.heads);
      query2 = query2.concat("'");

      deb_res2 = await pool.query(query2);

      // updating the expenditure of recurring or non recurring
      query2 = 'UPDATE ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table set ');
      query2 = query2.concat('expenditure =  ');
      query2 = query2.concat(temp_expenditure);
      query2 = query2.concat(" where heads = '");
      query2 = query2.concat(req.body.heads);
      query2 = query2.concat("'");

      deb_res2 = await pool.query(query2);

      // now updating the total balance and expenditure
      //var feilds_arr = ["'Manpower'","'Consumables'","'Travel'","'Field Testing/Demo/Tranings'","'Overheads'","'Unforseen Expenses'","'Equipments'","'Construction'","'Fabrication'"]
      var feilds_arr = ["'Rec.'", "'Non-Rec.'"];

      var total_bal = 0;
      var total_exp = 0;
      for (let step = 0; step < 2; step++) {
        // updating total balance
        query2 = 'SELECT * from ';
        query2 = query2.concat(req.body.project_id);
        query2 = query2.concat('_summary_table WHERE heads = ');
        query2 = query2.concat(feilds_arr[step]);

        db_res2 = await pool.query(query2);
        var total_bal = total_bal + db_res2.rows[0].balance;
        var total_exp = total_exp + db_res2.rows[0].expenditure;
      }
      /*
            var query2 = "UPDATE ";
            query2 = query2.concat(req.body.project_id)
            query2 = query2.concat("_summary_table set ")
            query2 = query2.concat("balance =  ");
            query2 = query2.concat(total_bal);
            query2 = query2.concat(" where heads = 'Total'")
            
            await pool.query(query2);*/

      // updating balance col
      query2 = 'UPDATE ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table set ');
      query2 = query2.concat('balance =  ');
      query2 = query2.concat(total_bal);
      query2 = query2.concat(" where heads = 'Total'");

      await pool.query(query2);

      // updating expenditure col
      query2 = 'UPDATE ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table set ');
      query2 = query2.concat('expenditure =  ');
      query2 = query2.concat(total_exp);
      query2 = query2.concat(" where heads = 'Total'");

      await pool.query(query2);

      // finally updating the expenditure table
      var query = 'INSERT INTO ';
      query = query.concat(req.body.project_id);
      query = query.concat('_main_table VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,$9)');
      const db_res = await pool.query(query, [
        cnt,
        req.body.particulars,
        req.body.remarks,
        req.body.vouchno,
        null,
        req.body.pay,
        total_bal,
        req.body.heads2,
        req.body.actual,
      ]);

      // updating the expenditure of the particular heads: -

      query2 = 'SELECT * from  ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table ');
      query2 = query2.concat(' where heads = $1');

      deb_res2 = await pool.query(query2, [req.body.heads2]);

      var temp_expenditure = deb_res2.rows[0].expenditure + req.body.pay;

      query2 = 'UPDATE ';
      query2 = query2.concat(req.body.project_id);
      query2 = query2.concat('_summary_table set ');
      query2 = query2.concat('expenditure =  ');
      query2 = query2.concat(temp_expenditure);
      query2 = query2.concat(" where heads = '");
      query2 = query2.concat(req.body.heads2);
      query2 = query2.concat("'");

      deb_res2 = await pool.query(query2);

      //returning 1 if the operation was successfull.
      res.json(1);
    }
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = { insertMainTable: insertMainTable };
