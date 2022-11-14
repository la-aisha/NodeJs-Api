const express = require('express')
const mongoose = require('mongoose')
const authRoute = require('./routes/auth')
const morgan = require('morgan')
const bodyParser = require('body-parser')


/* --- Connection avec la Bd */
mongoose.connect('mongodb://localhost:27017/immo',{ useUnifiedTopology:true })
const db = mongoose.connection 
db.on('error', (err)=>{
    console.log(err)
})

db.once('open', ()=>{
    console.log('database connection etablished !')
})

/* ---Connection avec le port */
const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000

app.listen(PORT ,()=> {console.log(`Server is started on port ${PORT}`)}) 

/* --- Route pour l'authentification */
app.use('/api' ,authRoute)

//module.exports = app;
