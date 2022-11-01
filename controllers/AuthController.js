const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req , res , next)=>{
   // var hashedPass =""
   var email = req.body.email
    User.findOne({email:email}).
    then(user =>{
        if(user){
            res.json({
                message : "ce nom existe deja"
            })
        }else{
            bcrypt.hash(req.body.password,10 ,function(err ,hashedPass){
                if(err){
                    res.json({
                        error : has
                    })
                }
               // var pass=  req.body.password = red.body.hashedPass
            
                let user = new User({
                    name : req.body.name ,
                    email : req.body.email ,
                    phone : req.body.phone ,
                    password : hashedPass,
            
                })
                user.save()
                .then(user =>{
                    res.json({
                        message : 'User add successfully ',
        
                    })
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

const login = (req,res, next)=>{
    var email = req.body.email
    var password = req.body.password
    User.findOne({$or : [{email:email},{phone:email}]})
    .then(user=>{
        if(user){
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
module.exports ={
    register ,login
}