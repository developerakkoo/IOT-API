const Service = require('../Modals/serviceModal');
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const io = require("../socket");

exports.postService = async(req, res, next) =>{
    try {
        let password = req.body.password;
        let email = req.body.email;
        
        Service.findOne({email: email})
        .then((service) =>{
            if(service){
                res.status(200).json({
                    message:"User Already Exists with email Address. Please Login!",
                    status: true,
                    userId: service._id
                })

                return;
            }
        
            bcrypt.hash(password, 12)
            .then((hashedPasswords) => {
                const service = new Service({
                    email: email,
                    password: hashedPasswords,
                })
        
                return service.save();
            }).then((result) => {
                res.status(201).json({message: 'Service Created Successfully!', status: '201', serviceId: result._id});
            }).catch((error) =>{
                res.status(404).json({
                    status: false,
                    message: error.message
                })
            })
        })

        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.loginService = async(req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;


    Service.findOne({ email: email})
    .then(user => {
        console.log(user);
        if(!user){
           res.status(400).json({message: 'User not found', status:'error'})
        }

        loadedUser = user;

        bcrypt.compare(password, user.password)
        .then(doMatch => {
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

exports.getService = async(req, res, next) =>{
    try {
        const service = await Service.find({});

        if(service){
            res.status(200).json({
                status: true,
                message: "All Services listed...",
                service
            })

            io.getIO().emit("get:service", service);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.getServiceById = async(req, res, next) =>{
    try {
        let id = req.params.id;

        const service = await Service.findById(id);
        if(service){
            res.status(200).json({
                status: true,
                message: "Service found...",
                service
            })


            io.getIO().emit("get:service", service);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.updateService = async(req, res, next) =>{
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body);
        if(service){
            res.status(200).json({
                status: true,
                message: "Service Updated...",
                service
            })

            io.getIO().emit("get:service", service);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}


exports.deleteService = async(req, res, next) =>{
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if(service){
            res.status(200).json({
                status: true,
                message: "Service Deleted...",
                service
            })

            io.getIO().emit("get:service", service);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}
const clearImage = (filePath) => {
    filePath = path.join(__dirname, "..", filePath);
    fs.unlink(filePath, (err) => console.log(err));
  };