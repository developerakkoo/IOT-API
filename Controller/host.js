const Host = require('../Modals/hostModal');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const io = require("../socket");

exports.loginHost = async(req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;


    Host.findOne({ email: email})
    .then(user => {
        if(!user){
           res.status(400).json({message: 'Host not found', status:'error'})
        }

        loadedUser = user;

        bcrypt.compare(password, user.password)
        .then(async (doMatch) => {
            if(!doMatch){
                res.status(400).json({message: 'Password do not match', status:'error'})

            }
             const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
            },"!23ThisisaSecretFor@#$%^%^^&&allthebest", {expiresIn: '3h'})

            res.status(200).json({
                message: 'Sign In Successfull',
                token: token,
                userId: loadedUser._id.toString(),
                expiresIn: '3h'
            })
        });
    }).catch(err =>{
        res.status(500).json({err, message: 'Something went wrong!'})

    })
}

exports.postHost = async(req, res, next) =>{
    // try {



        Host.findOne({ email: req.body.email})
        .then(user => {
            if(user){
                res.status(400).json({
                    status: false,
                    message: 'Host with email already exists. Please use another email.'
                })
            }
    
            bcrypt.hash(req.body.password, 12)
            .then((hashedPasswords) => {
                const user = new Host({
                    email: req.body.email,
                    password: hashedPasswords,
                    mobileNo: req.body.mobileNo,
                    image: req.body.image,
                    address: req.body.address,
                    IFSC: req.body.IFSC,
                    bankName: req.body.bankName,
                    AccountNumber: req.body.AccountNumber,
                    AccountHolderName: req.body.AccountHolderName,
                    cords: req.body.cords
                })
        
                return user.save();
            }).then(async (result) => {
                res
                .status(201)
                .json({message: 'Host Created Successfully!', status: '201', result, userId: result._id});
            }).catch((error) =>{
                res.status(404).json({
                    status: false,
                    message: error.message
                })
            })
        })

        
    // } catch (error) {
    //     res.status(500).json({
    //         status: false,
    //         message: error.message,
    //         error
    //     })
    // }
}

exports.getHost = async(req, res, next) =>{
    try {
        const host = await Host.find({});

        if(host){
            res.status(200).json({
                host,
                status: true,
                length: host.length,
                message: "All host Found!"
            })

            io.getIO().emit("get:host", host);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.getHostById = async(req, res, next) =>{
    try {
        const host = await Host.findById(req.params.id);
        if(host){
            res.status(200).json({
                host,
                status: true,
                message: "host Found!"
            })
            io.getIO().emit("get:host", host);



        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.updateHost = async(req, res, next) =>{
    try {
        const host = await Host.findByIdAndUpdate(req.params.id, req.body);
        if(host){
            res.status(200).json({
                host,
                status: true,
                message: "host Updated!"
            })

            io.getIO().emit("get:host", host);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}


exports.deleteHost = async(req, res, next) =>{
    try {
        const host = await Host.findByIdAndDelete(req.params.id);
        if(host){
            res.status(200).json({
                host,
                status: true,
                message: "host deleted!"
            })

            io.getIO().emit("get:host", host);

        }
        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}