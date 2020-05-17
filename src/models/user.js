const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    token:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.toJSON =  function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.token;
    console.log(userObject)
    return userObject;
}
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const privateKey = 'somethingspecial';
    const token = jwt.sign({_id:user._id.toString()},privateKey)
    return token;
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email});
    if(!user){
        throw new Error('Unable to login email error')
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        throw new Error('Unable to login password error')
    }
    return user;
}



// match the plain text password before saving
userSchema.pre('save', async function(next) {
   const user = this;

   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password,8)
   }
    console.log(" saved the data here ");
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User