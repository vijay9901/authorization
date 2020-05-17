const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 3000



// app.use((req,res,next)=>{
// const maintaince = true;
//     if(maintaince == true){
        
//         res.status(503).send(" server is under maintaince ")
//     }else{
//         next()
//     }
// })
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const bcrypt = require('bcryptjs')

const myFunction = async () => {
   const privateKey = 'somethingspecial';
    const token = jwt.sign({_id:"akkk"},privateKey,{expiresIn:'7 days'})
   console.log(token)
   const data = jwt.verify(token,privateKey);
   console.log(data)
    // const password = 'Red12345!'
    // const hashedPassword = await bcrypt.hash(password, 8)

    // console.log(password)
    // console.log(hashedPassword)

    // const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
    // console.log(isMatch)
}

myFunction()