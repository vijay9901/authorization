const express = require('express')
const User = require('../models/user')
const router = new express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
       // res.status(201).send(user)
        const token = await user.generateAuthToken();
        
        res.status(201).send({user,token});
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken();
        // user.token = user.token.concat({token})
        // await user.save()   
        res.send({user,token});
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
})
router.post('/user/logoutAll',auth,async (req,res)=>{

    try {
        
        req.user.token = []
        await req.user.save();
        res.send()
    } catch (error) {
     
        res.status(500).send()
    }
})

router.post('/user/logout',auth,async (req,res)=>{

    try {
        
        req.user.token = req.user.token.filter((token)=>{
            console.log(token.token);
            return token.token!== req.token
        })
        await req.user.save();
        res.send()
    } catch (error) {
       // console.log(error)
        res.status(500).send()
    }
})
router.get('/users',auth, async (req, res) => {

        res.send(req.user)

})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const user = await User.findById(req.params.id);
        updates.forEach((update)=> user[update]=req.body[update]);
        await user.save()
      // console.log(await bcrypt.hash(req.body.password,8));
      //  const user = new User(req.body)

      // try {
        //console.log( await user.save())
       // req.body.password = await bcrypt.hash(req.body.password,8);
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router