const User = require('../models/Users')
const Userotp = require('../models/UserOtpVerification')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require("nodemailer");
const UserOtpVerification = require('../models/UserOtpVerification');

/* --- Register */
const register = (req , res , next)=>{
  
    /* --- Unique Email */
   var email = req.body.email
    User.findOne({email:email}).
    then(user =>{
        if(user){
            res.json({
                message : "ce nom existe deja"
            })
        }else{
            /* --- Cryptage du mot de passe */
            bcrypt.hash(req.body.password,10 ,function(err ,hashedPass){
                if(err){
                    res.json({
                        error : has
                    })
                }
                /* -- Creation de  Objet user */
                let user = new User({
                    firstname : req.body.firstname ,
                    lastname : req.body.lastname ,
                    email : req.body.email ,
                    phone : req.body.phone ,
                    password : hashedPass,
                    verified : false
                    //confirmationCode: token
                })

                /* --- Enregistrement de User */
                user.save()
                .then(user =>{
                    sendOtpMail(user , res)
                   /*  res.json({
                        message : ' user has been added successfully',
        
                    }) */
                    console.log(user) 
                })
                .catch(error=>{
                    res.json({
                        message : 'an error is occured'
                    })
                })

            }) 
        }
    })  
}

/* ---Login */
const login = (req,res, next)=>{
    /* ---- Verif email et password */
    var email = req.body.email
    var password = req.body.password
    User.findOne({$or : [{email:email},{phone:email}]})
    .then(user=>{
        if(user){
            /* --- Si utilisateur trouve compare mdp 3 etape */
            bcrypt.compare(password , user.password , function(err ,result){
                if(err){
                    res.json({
                        message : err
                    })
                }
                if(result){
                    let token = jwt.sign({name : user.name} , 'verySecretValue' , {expiresIn : '1h'})
                    res.json({
                        message : "Login sucessful",
                        token : token
                    })
                }else{
                    res.json({
                        message : "Password doesnt match"
                    })
                }
            })

        }else{
            res.json({
                message : "no user found !"
            })
        }
    })

}

/* --- Otp verification */
const sendOtpMail = async ({_id ,email}, res)=>{
    try{
        const otp = `${Math.floor(1000+Math.random()*9000)}`
        /* --- mail option */
        const mailOption = {
            //from : "process.env.AUTH_EMAIL",
            from : "aishaseye074@gmail.com",
            to : email ,
            subject : "Verify your Emailx",
            html : `<p>Entrer the ${otp} in the app to verify your email address and complete your registration ,it will expire in 1 hour</p4> `
        }
        /* --- hash the otp */
        const saltRounds =10 ;
        const hashOtp = await bcrypt.hash(otp ,saltRounds)
        const newOtpVerification = await new UserOtpVerification({
            userId : _id ,
            otp : hashOtp ,
            createdAt : Date.now() ,
            expireAt : Date.now()+3600000 , 
        })
           
        /* --- save Otp */
        await newOtpVerification.save() ;
        await transporter.sendMail(mailOption) ;
        res.json({
            status : "PENDING",
            message : "Verification email sent",
            data : {
                userId: _id ,
                email
            }
        })
    }
    catch(error){
        res.json({
            status : "Failed",
            message : error.message
        }) ;
    }
}

/* --- node mailer */
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user : 'aishaseye074@gmail.com' ,
        pass : 'dbkpmfqmwrouxizd '
    },
})
 
/* --- transport success */
   transporter.verify((error , success)=>{
    if(error){
        console.log(error);
    }else{
        console.log("Ready for messages") ;
        console.log("Success") ;
    }
})   
/* ---Export les deux module */
module.exports ={
    register ,login 
}