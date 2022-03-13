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
        const db_res = await pool.query(" INSERT INTO users VALUES ($1,$2) RETURNING * ",[req.body.email_id,req.body.admin]);
        
        //returning the row that was inserted
        res.json(db_res.rows[0]);
    
    } catch (error) {
        console.error(error.message);
    }
})

// to get the list of all projects 
app.post("/project",async function(req,res){

    try{
        //running the select command
        if(req.body.sort==1)
        {
            // sorting by the comment time
            const db_res = await pool.query("SELECT * from projects ORDER BY comment_time DESC");
            
            console.log("REQUEST RECEIVED");

            //returning all the rows
            res.json(db_res.rows);
        }
        else
        {
            //sorting by grant money
            const db_res = await pool.query("SELECT * from projects ORDER BY grant");

            //returning all the rows
            res.json(db_res.rows[0]);
        }
        

    }catch(error){
        console.error(error.message);
    }

});


// to get a specific project 

app.get("/project/:id",async function(req,res){

    try{
        //running the select command
        const db_res = await pool.query("SELECT * from projects WHERE project_id = $1",[req.params.id]);

        //returning all the rows
        res.json(db_res.rows[0]);
        
        

    }catch(error){
        console.error(error.message);
    }

});

// to create a new project

app.post("/project",async function(req,res){

    try {
        // the data we get from request , just printing it 
        console.log(req.body);

        // running the insert command 
        const db_res = await pool.query(" INSERT INTO projects VALUES ($1,$2,$3,$4,current_timestamp) RETURNING * ",[req.body.project_id,req.body.project_title,req.body.professors,req.body.grant]);
        
        // now corresponding to each professor we need to make an entry in his corresponding project table 
        var prof_emails = req.body.professors.split(',');

        for(var i in prof_emails)
        {
            var prof_id = prof_emails[i];
            db_res = await pool.query("INSERT INTO $1_projects VALUES ($2,$3,$4)",[prof_id,req.body.project_id,req.body.project_title,req.body.grant]);            

        }

        // also we need to make 2 seperate tables for each project(the summary table and the main one )


        //returning 1 since everything was a success 
        res.json(1);
    
    } catch (error) {
        console.error(error.message);
    }

})


// to give projects on profs dashboard

app.get("/project_prof/:id",async function(req,res){

    try{

        //running the select command
        const db_res = await pool.query("SELECT * from $1_projects",[req.params.id]);

        //returning all the rows
        res.json(db_res.rows[0]);
        
    }catch(error){
        console.error(error.message);
    }

});



app.listen(5000,function(){
    console.log("Listening ");
})