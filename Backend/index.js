var express = require("express");
var app = express();

// cors allows communication from differnt domains(requests to our server) 
const cors = require("cors");

const PORT = process.env.PORT|| 5000

const jwt = require("jsonwebtoken")

//creating middleware
app.use(cors());

//allowing us to extract json data from a request
app.use(express.json());

app.use(express.static('public'));
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client("277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com")

function verifyToken(req,res,next){
    // extracting token from the header of the request 
    const token = req.headers["jwt-token"]

    if(!token){
        // if token not received then send a msg that we need token
        res.send("Please supply token")
    }
    else{
        // else verify that the token is correct 

        jwt.verify(token ,"jwtTempSecret",(err,authData)=>{
            if(err){
                res.json({
                    auth:false,
                    message : "authentication failure"
                })
            }
            else 
            {
                //go to next in case the token is verified 
                next();
            }
        })
    }
}

app.post("/test_temp",verifyToken,(req,res)=>{
    res.json(699)
})

app.post("/authenticate",async function(req,res){
    try {
        
        // the body that we received 

        var query2 = "SELECT * FROM users where email_id = '"
        query2 = query2.concat(req.body.email)
        query2 = query2.concat("'")

        const db_res = await pool.query(query2)
        
        if(db_res.rows[0]==undefined)
        {
            // if the user himself is not valid then send -1
            res.json(-1);    
        }
        else{

            console.log(req.body)

            const {token} = req.body;
            
            // verifying the google login sent 
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: "277372439327-34b2v50u9nner2fulahklo3au5vbh911.apps.googleusercontent.com"
            });

            // making jwt token 

            const email_id = db_res.rows[0].email_id;
            const jwt_token = jwt.sign({email_id},"jwtTempSecret",{
                // value 300 corresponds to 5 mins 
                expiresIn: 18000
            })


            res.json({
                auth: true,
                token : jwt_token,
            })      
            
        }        
 
    } catch (error) {
        console.error(error.message);
    }
})


//Routes
app.use(require('./components/userType'));
app.use(require('./components/addUser'));  
app.use(require('./components/getUser'));
app.use(require('./components/getMainTable')); 
app.use(require('./components/getSummaryTable'));  
app.use(require('./components/insertMainTable'));   
app.use(require('./components/listOfProjects'));     
app.use(require('./components/specificProject'));      
app.use(require('./components/createProject')); 
app.use(require('./components/addFund'));
app.use(require('./components/addComment'));           
app.use(require('./components/sendMail'));
app.use(require('./components/getComment'));
app.use(require('./components/showProjects'));    
app.use(require('./components/addSummaryComment'));    
app.use(require('./components/getSummaryComment'));    
app.use(require('./components/updatedAddFund'));    
app.use(require('./components/delrow'));    
app.use(require('./components/editSanctioned'));    
app.use(require('./components/delUser'));  
app.use(require('./components/delProject'));  
app.use(require('./components/ToActual'));  
app.listen(PORT,function(){
    console.log("Listening ");
})