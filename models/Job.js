const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true, 'Please provide a company.'],
        trim: true,
        minLength: 3,
        maxLength: 50
    },
    position:{
        type: String,
        required: [true, 'Please provide a position.'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    status:{
        type: String,
        enum: ['pending', 'review', 'declined'],
        default: 'pending'
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a userID']
    }
}, {timestamps: true});

module.exports = mongoose.model('Job', JobSchema);