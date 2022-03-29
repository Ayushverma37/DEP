var express = require("express");
var app = express();

// cors allows communication from differnt domains(requests to our server) 
const cors = require("cors");

//creating middleware
app.use(cors());

//allowing us to extract json data from a request
app.use(express.json());

app.use(express.static('public'));
 
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


app.listen(5000,function(){
    console.log("Listening ");
})