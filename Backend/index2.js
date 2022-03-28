const express = require("express");
const app = express();

// cors allows communication from differnt domains(requests to our server) 
const cors = require("cors");

// to run sql queries
const pool = require("./db");


//creating middleware
app.use(cors());
//allowing us to extract json data from a request
app.use(express.json());



// routes that can be accessible 

// to get the type of the user
app.get("/user/:email",async function(req,res){
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
});


// to add a user 
app.post("/user",async function(req,res){
    try {
        // the data we get from request , just printing it 
        console.log(req.body);

        // running the insert command 
        const db_res = await pool.query(" INSERT INTO users VALUES ($1,$2,$3) RETURNING * ",[req.body.email_id,req.body.name,req.body.admin]);
        
        // creating a table for this prof:-
        if(req.body.admin==2){
            // first extracting the entry number
            var email = req.body.email_id;
            var index = email.indexOf("@")




            var str_query = "CREATE TABLE ";
            str_query=str_query.concat(email.substring(0,index));
            str_query= str_query.concat("_proj_list");
            str_query=str_query.concat(" (project_id text,project_title text,professor_list text,project_grant int,comment_time TIMESTAMP with time zone)");
            console.log(str_query);
            const db_res2= await pool.query(str_query)
        }        

        var db_res3 = await pool.query("SELECT * from users");
        //returning all the row that were inserted
        res.json(db_res3.rows);
    
    } catch (error) {
        console.error(error.message);
    }
})

app.post("/get_user",async function(req,res){
    try {
        // the data we get from request , just printing it 
        console.log(req.body);
        
        var db_res3 = await pool.query("SELECT * from users");
        //returning all the row that were inserted
        res.json(db_res3.rows);
    
    } catch (error) {
        console.error(error.message);
    }
})

// to get the details of main table of a project 

app.post("/get_main_table",async function(req,res){

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

});

app.post("/get_summary_table",async function(req,res){

    try{

        //getting the details from the project (main) table 
        var query = "SELECT * from "
        query = query.concat(req.body.project_id)
        query=query.concat("_summary_table order by sr asc");
        const db_res = await pool.query(query);

        //returning all the rows received from the table

        temp_res = db_res.rows;

        res.json(db_res.rows);

        
    }catch(error){
        console.error(error.message);
    }

});

// to insert into a main table of a project 

app.post("/insert_main_table",async function(req,res){

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


// to get the list of all projects 
app.post("/project",async function(req,res){

    try{
        //running the select command
        if(req.body.sort==1)
        {
            // sorting by the comment time
            var db_res = await pool.query("SELECT * from projects ORDER BY comment_time DESC");
            
            console.log("REQUEST RECEIVED");
            
            //console.log(db_res.rows[0].comment_time.toLocaleTimeString("en-US"));
            
            var temp_json = db_res.rows;
            
            console.log(temp_json.length);

            for (let step = 0; step < temp_json.length; step++) {
                
                temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
                
                
                var prof_emails = temp_json[step].professor_list.split(',');
                var to_ret = ""
                for (var i in prof_emails) {
                    // extracting the user names 
                    db_res = await pool.query("SELECT * FROM users where email_id = $1", [prof_emails[i]]);
                    
                    to_ret=to_ret.concat(" ");
                    to_ret=to_ret.concat(db_res.rows[0].user_name);
                }
                temp_json[step].names = to_ret;
            }

            console.log(temp_json);
            //returning all the rows
            res.json(temp_json);


        }
        else
        {
            //sorting by grant money
            const db_res = await pool.query("SELECT * from projects ORDER BY grant");

            //returning all the rows
            res.json(db_res.rows);
        }
        

    }catch(error){
        console.error(error.message);
    }

});


// to get a specific project 

app.get("/project/:id",async function(req,res){

    try{

        var query = "SELECT * FROM projects WHERE project_title LIKE '%"
        query = query.concat(req.params.id)
        query = query.concat("%' ")
        //running the select command

        const db_res = await pool.query(query);

        var temp_json = db_res.rows;
            
            console.log(temp_json.length);

            for (let step = 0; step < temp_json.length; step++) {
                
                temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
            }

        console.log(temp_json)

        //returning all the rows
        res.json(temp_json);
        
    }catch(error){
        console.error(error.message);
    }

});

// to create a new project
app.post("/create_project",async function(req,res){

    try {
        // the data we get from request , just printing it 
        console.log(req.body);

        // running the insert command 
        var db_res = await pool.query(" INSERT INTO projects VALUES ($1,$2,$3,$4,current_timestamp) RETURNING * ",[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant]);
        
        // now corresponding to each professor we need to make an entry in his corresponding project table 
        var prof_emails = req.body.professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");

            var prof_id = prof_emails[i].substring(0,index);
            console.log(prof_id)
            var query = "INSERT INTO "
            query=query.concat(prof_id)
            query=query.concat("_proj_list VALUES ($1,$2,$3,$4,current_timestamp)");
            db_res = await pool.query(query,[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant]);            

        }

        // also we need to make 2 seperate tables for each project(the summary table and the main one )

        // creating the main_table:-
        var query="CREATE TABLE ";
        query=query.concat(req.body.project_id)
        query=query.concat("_main_table (sr int , particulars text , remarks text ,vouchNo text, rec text , payment int , balance int , heads text) ")
        deb_res = await pool.query(query)

        // creating the comments table 
        query = "CREATE TABLE "
        query = query.concat(req.body.project_id)
        query = query.concat("_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")
        deb_res = await pool.query(query)
        

        // creating the sumarry table
        query="CREATE TABLE ";
        query=query.concat(req.body.project_id)
        query=query.concat("_summary_table (sr int , heads text , sanctioned_amount int ,year_1_funds int,year_2_funds int , year_3_funds int ,expenditure int , balance int) ")
        deb_res = await pool.query(query)

        // creating the comment table for the summary table
        query = "CREATE TABLE "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")

        deb_res = await pool.query(query)

        // now inserting the initial rows in the table 
        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (1,'Manpower',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.manpower])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (2,'Consumables',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.consumables])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (3,'Travel',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.travel])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (4,'Field Testing/Demo/Tranings',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.field])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (5,'Overheads',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.overheads])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (6,'Unforseen Expenses',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.unforseen])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (7,'Equipments',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.equipments])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (8,'Construction',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.construction])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (9,'Fabrication',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.fabrication])

        query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table VALUES (10,'Total',$1,0,0,0,0,0)");
        deb_res = await pool.query(query,[req.body.grant])

        //returning 1 since everything was a success 
        res.json(1);
    
    } catch (error) {
        console.error(error.message);
    }

})

// now to add a fund
app.post("/fund",async function(req,res){

    try{

        

        // first extracting the total of all the years 

        var query = "SELECT * from "
        query = query.concat(req.body.project_id)
        query = query.concat("_summary_table WHERE heads = 'Total' ");
        
        var db_res = await pool.query(query);

        

        var feilds_arr = ["'Manpower'","'Consumables'","'Travel'","'Field Testing/Demo/Tranings'","'Overheads'","'Unforseen Expenses'","'Equipments'","'Construction'","'Fabrication'"]
        var val_arr = [Number(req.body.manpower),Number(req.body.consumables),Number(req.body.travel),Number(req.body.field),Number(req.body.overheads),Number(req.body.unforseen),Number(req.body.equipments),Number(req.body.construction),Number(req.body.fabrication)]

        if(db_res.rows[0].year_1_funds == 0 ){
            
            var total = 0;
            for (let step = 0; step < 9; step++) {
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
            for (let step = 0; step < 9; step++) {
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
            for (let step = 0; step < 9; step++) {
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
        for (let step = 0; step < 9; step++) {
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
        query=query.concat("_main_table VALUES ($1,$2,$3,$4,$5,NULL,$6,$7)");
        db_res = await pool.query(query,[cnt,req.body.particulars,req.body.remarks,req.body.vouchno,req.body.rec,total,"Grant"]);

        //returning 1 since everything was a success 
        res.json(1);
        


    }catch(error){
        console.error(error.message);
    }

});





// addding a comment
app.post("/comment",async function(req,res){

    try{

        
        // adding a comment for a particular project.
        
        var query = "INSERT INTO "
        query = query.concat(req.body.project_id);
        query=query.concat("_comment_table VALUES ($1,$2,$3,current_timestamp,'NO')");
        const db_res = await pool.query(query,[req.body.row_no,req.body.comment_body,req.body.prof_email]);


        const db_res2 = await pool.query("UPDATE projects set comment_time = current_timestamp where project_id = $1",[req.body.project_id]);

        var db_res4 = await pool.query("SELECT professor_list from projects where project_id = $1",[req.body.project_id]);

        var professors = db_res4.rows[0].professor_list;
        var prof_emails =professors.split(',');

        for(var i in prof_emails)
        {
            // extracting the email before @
            var index = prof_emails[i].indexOf("@");

            var prof_id = prof_emails[i].substring(0,index);
            console.log(prof_id)
            var query = "UPDATE "
            query=query.concat(prof_id)
            query=query.concat("_proj_list SET comment_time = current_timestamp where project_id = $1");
            var db_res6 = await pool.query(query,[req.body.project_id]);            

        }

        //returning 1 to status 
        res.json(1);
        
    }catch(error){
        console.error(error.message);
    }
}
);

// to get a comment
app.post("/get_comment",async function(req,res){

    try{

        // adding a comment for a particular project.
        var query ="SELECT * FROM "
        query=query.concat(req.body.project_id);
        query = query.concat("_comment_table where sr=$1 order by comment_time desc")
        const db_res = await pool.query(query,[req.body.row_no]);

        var temp_json = db_res.rows;

        for (let step = 0; step < temp_json.length; step++) {
                
            temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
        }
        
        console.log(temp_json);

        //returning all the rows
        res.json(temp_json);
        
    }catch(error){
        console.error(error.message);
    }
}
);


// to give projects on profs dashboard
app.get("/project_prof/:email_id",async function(req,res){

    try{

        var index = req.params.email_id.indexOf("@");

        var prof_id = req.params.email_id.substring(0,index);
        console.log(prof_id)
        //running the select command
        var query = "SELECT * from "
        query=query.concat(prof_id)
        query=query.concat("_proj_list order by comment_time desc")
        var db_res = await pool.query(query);


        var temp_json = db_res.rows;

        for (let step = 0; step < temp_json.length; step++) {
                
            temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
            // extracting names of professors and returning that as well
            var prof_emails = temp_json[step].professor_list.split(',');
            var to_ret = ""
            for (var i in prof_emails) {
                // extracting the user names 
                db_res = await pool.query("SELECT * FROM users where email_id = $1", [prof_emails[i]]);

                to_ret = to_ret.concat(" ");
                to_ret = to_ret.concat(db_res.rows[0].user_name);
            }
            temp_json[step].names = to_ret;
        }
        
        console.log(temp_json);

        //returning all the rows
        res.json(temp_json);


        //returning all the rows
        //res.json(db_res.rows);
        
    }catch(error){
        console.error(error.message);
    }

});

app.listen(5000,function(){
    console.log("Listening ");
})