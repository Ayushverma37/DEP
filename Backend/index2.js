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
        query=query.concat("_main_table");
        const db_res = await pool.query(query);

        //returning all the rows received from the table
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

        var query = "INSERT INTO "
        query = query.concat(req.body.project_id)
        query=query.concat("_main_table VALUES ($1,$2,$3,$4,$5,$6,$7,$8)");
        const db_res = await pool.query(query,[cnt,req.body.particulars,req.body.remarks,req.body.vouchno,req.body.rec,req.body.pay,req.body.balance,req.body.heads]);

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
            const db_res = await pool.query("SELECT * from projects ORDER BY comment_time DESC");
            
            console.log("REQUEST RECEIVED");
            
            //console.log(db_res.rows[0].comment_time.toLocaleTimeString("en-US"));
            
            var temp_json = db_res.rows;
            
            console.log(temp_json.length);

            for (let step = 0; step < temp_json.length; step++) {
                
                temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
            }

            console.log(temp_json);
            //returning all the rows
            res.json(db_res.rows);
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
        query=query.concat("_main_table (sr text , particulars text , remarks text ,vouchNo text, rec text , pay text , balance text , heads text) ")
        deb_res = await pool.query(query)

        // creating the comments table 
        query = "CREATE TABLE "
        query = query.concat(req.body.project_id)
        query = query.concat("_comment_table (sr text,comment text,person text,comment_time TIMESTAMP with time zone,resolved text)")
        deb_res = await pool.query(query)
        
        //returning 1 since everything was a success 
        res.json(1);
    
    } catch (error) {
        console.error(error.message);
    }

})

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
        const db_res = await pool.query(query);


        var temp_json = db_res.rows;

        for (let step = 0; step < temp_json.length; step++) {
                
            temp_json[step].comment_time=temp_json[step].comment_time.toLocaleDateString("en-US")+" "+temp_json[step].comment_time.toLocaleTimeString("en-US")
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