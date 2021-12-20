const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
const cors = require("cors");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const SingUpModel = require('./SingUpModel');


mongoose.connect(`mongodb://${process.env.Database_User}:${process.env.Database_Pass}@cluster0-shard-00-00.mgll3.mongodb.net:27017,cluster0-shard-00-01.mgll3.mongodb.net:27017,cluster0-shard-00-02.mgll3.mongodb.net:27017/singUp?ssl=true&replicaSet=atlas-6onnuf-shard-0&authSource=admin&retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("connection successfull");
}).catch(err=>{
    console.log(err);
})





app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))

let PORT = process.env.PORT||5000;


const privateKey = process.env.Private_Key;




// check user already exist


const userExitCheck = async (req, res, next)=>{

    try {

    const userInfo = req.body;

    console.log(userInfo);

    const getUserEmail = await SingUpModel.find({email:userInfo?.email})

    if (getUserEmail.length>0) {
        res.status(409).json({msg:"User already exist!!!"})
    }
    else{

        next();
    }
        
    } catch (error) {
        console.log(error);
        
    }
    





}



// email validily check 

const validEmail = async(req, res, next)=>{

    const {email} = req.body;
    console.log(email);

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const result = re.test(String(email).toLowerCase())
    console.log(result);

    if (result === true) {
        next()
    }
    else{
        res.status(401).json({msg:"email not valid!!"})
    }



}




app.post('/sing-up',userExitCheck,validEmail, async(req, res)=>{


    try {


        const userInfo = req.body;
    const {firstName, lastName, password, email} = req.body;


    console.log(userInfo);

    const saltRounds = 10;

    if (userInfo?.password.length>5) {
        bcrypt.hash(userInfo?.password, saltRounds, function(err, hash) {

            console.log(hash);


            let newUserInfo ={
                firstName:firstName,
                lastName:lastName,
                email:email,
                password:hash
            }


            const userSave =  SingUpModel(newUserInfo);

            userSave.save((err)=>{
                if (err) {
                    res.status(400).json({msg:"Plaese give the full information"})
                }
                else{
                    res.status(200).json({msg:"sing up is completed successfully"})
                }
            });

            


        });
        
    }
    else{

        res.status(401).json({msg:"password must be 6 character"})
    }
        




    } catch (error) {

        console.log(error);
        
    }
   







})





app.get('/', (req, res)=>{


    res.send('connected')



} )





// log in route 



app.post("/login", async(req, res)=>{

 const {email, password} = req.body;

 try {

    const findUser = await SingUpModel.find({email:email});

    if (findUser.length>0) {

        const userHashPassword = findUser[0]?.password;
        bcrypt.compare(password, userHashPassword, function(err, result) {

            console.log(result);


            if (result===true) {

                const createUserName = findUser?.firstName+findUser?.email

               let tocken =  jwt.sign(createUserName,privateKey)
            

                res.cookie('tocken',tocken, { expires: new Date(Date.now() + 900000), httpOnly: true })
                res.status(200).json({msg:"log in successfull"})
                
            }
            else{
                res.status(401).json({msg:"Incorrect password!!"})

            }
            



        });
        
    }

    else{
        res.status(401).json({msg:"user not valid!!"})

    }





     
 } catch (error) {
     
 }








})














app.listen(PORT, ()=>{


    console.log('server is running' ,PORT);
})











