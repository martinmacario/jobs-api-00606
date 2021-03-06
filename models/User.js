const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name'], 
        minLenght: 3,
        maxLenght: 50,
        trim: true
    },
    email:{
        type: String,
        required: [true, 'Please provide a email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
        minLenght: 6,
        // maxLenght: 12,
        trim: true
    }

});

UserSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.createJWT = function() {
    return jwt.sign(
        {name: this.name, userId: this._id},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

UserSchema.methods.comparePasswords = async function(providedPassword) {
    const isMatch = await bcrypt.compare(providedPassword, this.password);
    return isMatch;
}
module.exports = mongoose.model('User', UserSchema);