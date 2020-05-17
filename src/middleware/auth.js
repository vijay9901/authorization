const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = async (req,res,next) =>{

    try {
        //console.log(req.header.Host)
        const privateKey = 'somethingspecial';
        const token = req.header('Authorization').replace("Bearer ",'');
        const decoded = jwt.verify(token,privateKey);
        const user = await User.findOne({_id:decoded._id,'token.token':token})
        
        console.log(decoded._id,'vijay')
        if(!user){
            throw new Error()
        }
        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send({'error':'Please authenticate ...'})
        
    }
    // console.log(" middleware call");
    // next();
}

module.exports =auth