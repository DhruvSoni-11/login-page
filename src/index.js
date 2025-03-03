const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
// consvert data into json format
app.use(express.json());

app.use(express.urlencoded({extended: false}));

// use EJS as the view engine
app.set('view engine', 'ejs');
// static file
app.use(express.static("public"))

app.get("/",(req,res)=> {
    res.render("login2");
})

app.get("/signup",(req,res) => {
    res.render("signup");
})

// Register User
app.post("/signup",async(req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }
    
    //check if the user already exists in the database
    const existingUser = await collection.findOne({name : data.name});
    if(existingUser){
        res.send("User already exists. Please choose a different username.");
    }else{
        //hash the password  -- bcrypt
        const saltRounds = 10;
        const hashesPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashesPassword; //Replace the hash password with original password
        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.render("home");
    }

});


// Login user
app.post("/login",async(req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check){
            req.send("user name cannot found");
        }

        // compare the mash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch) {
            res.render("ht");
        }else {
            req.send("wrong password");
        }
    }catch{
            res.send("wrong Details");
        }
});


const port = 5000;
app.listen(port,() => {
    console.log(`Server running on Port : ${port}`);
})