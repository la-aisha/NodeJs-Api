const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const email_match =  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/


/* --- Creattion du Schema */
const userSchema = new Schema({

    firstname : {
        type : String 
    },
    lastname : {
        type : String 
    },
    email : {
        type : String ,match : email_match
    },
    phone: {
        type : String 
    },
    password : {
        type : String 
    },
    verified : {
        type : Boolean
    },
   /*  status: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: { 
        type: String, 
        unique: true 
    }, */

} ,{timestamps : true} ) 


/* ---Exportation du model */

const User = mongoose.model('User' , userSchema) 
module.exports = User
