const jwt = require('jsonwebtoken')

const authenticate =(req, res ,next)=>{
    try{
        const token = red.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token , 'secretValue')

        req.user = decode

        next()
    }catch{
        res.json({
            message : "Authentication failed"
        })

    }
}