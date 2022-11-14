const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')
/* ----- Enregistrement des routes */
router.post('/register',AuthController.register)
router.post('/login',AuthController.login)
router.post('/otpmail',AuthController.login)

//router.post('/loginOtp',AuthController.login)



module.exports = router