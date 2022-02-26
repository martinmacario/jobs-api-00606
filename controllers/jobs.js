const Job = require('../models/Job')
const {StatusCodes} =require('http-status-codes')
const { BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({jobs, count: jobs.length});
}
const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job});
}

const getJob = async (req, res) => {

    const {
        user:{userId},
        params: {id: jobId}
    } = req;

    const job = await Job.findOne({ createdBy: userId, _id: jobId });

    if (!job ){
        console.log('not found')
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).json({job});
}

const updateJob = async (req, res) => {
    const{
        user: {userId},
        params: {id: jobId},
        body: {company, position, status}
    } = req;

    if (!company || !position) {
        throw new BadRequestError('Please provide company and position')
    }

    const newJobAttributes = {
        'company': company,
        'position': position
    }
    if (status) {
        newJobAttributes.status = status;
    }
    const updatedJob = await Job.findOneAndUpdate({
        createdBy: userId,
        _id: jobId
    },
    newJobAttributes, {
        new: true,
        runValidators:true
    });


    if (!updatedJob) {
        throw new NotFoundError(`Not job found with id: ${jobId}`);
    }

    res.status(StatusCodes.OK).json({updatedJob});

}
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req;

    const job = await Job.findByIdAndRemove({ createdBy: userId, _id: jobId });

    if (!job) {
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }

    res.status(StatusCodes.OK).send();
}

module.exports = {
    getAllJobs,
    createJob,
    getJob,
    updateJob,
    deleteJob
}