const User = require('../models/User');
const {StatusCodes} = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors')
// const bcrypt = require('bcryptjs');

const register = async (req, res) =>{
    // const {name, email, password} = req.body;
    // if (!name || !email || !password) {
    //     throw new BadRequestError('Please provide name, email and password.')
    // }

    // const salt = await bycrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    // await User.deleteMany({});
    const user = await User.create(
        {...req.body}
    );

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
        user: {
            name: user.name
        },
        token
    });
}
const login = async (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({email});

    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = await user.comparePasswords(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const token = user.createJWT();
    res.status(StatusCodes.OK).json({user:{name:user.name}, token});
}

module.exports = {
    register,
    login
}