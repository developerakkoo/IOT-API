const UserAuth = require('../Modals/userModal');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const io = require("../socket");


const razorpay = require('razorpay');

var instance = new razorpay({
    key_id:'rzp_test_q92KbX0ZwFyaN0',
    key_secret:'UsklYi4BRYogWcehPPjnBtSu',
});


exports.createOrder = async(req, res, next) => {
    try {
        const amount = req.body.amount;
        
        var options = {
            amount: amount,
            currency:'INR'
        }

        instance.orders.create(options, function(err, order) {
            console.log("ORDER: " + order);

            if(err) {
                res.status(400).json({ message: err.message, status: 'error' });
            }

            res.status(201).json({status: 'success', message: 'Order Created.', order});
        });
    } catch (error) {
        res.status(400).json({message: error.message, status:'error'});
    }
}


exports.loginUser = async(req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;


    UserAuth.findOne({ email: email})
    .then(user => {
        if(!user){
           res.status(400).json({message: 'User not found', status:'error'})
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


exports.postSignup = (req, res, next) => {

    const host = req.hostname;

    if (!req.file) {
      res.status(404).json({
        status: false,
        message: 'Please provide a image'
      })
    }

    const imageUrl = req.file.path.replace(/\\/g, "/");
    console.log(imageUrl);

    const email = req.body.email;
    const password = req.body.password;
    const mobileNo = req.body.mobileNo;


    UserAuth.findOne({ email: email})
    .then(user => {
        if(user){
            res.status(400).json({
                status: false,
                message: 'User with email already exists. Please use another email.'
            })
        }

        bcrypt.hash(password, 12)
        .then((hashedPasswords) => {
            const user = new UserAuth({
                email: email,
                password: hashedPasswords,
                mobileNo: mobileNo,
                image: req.protocol + '://' + req.hostname +":" + process.env.PORT + '/' + imageUrl
            })
    
            return user.save();
        }).then((result) => {
            res.status(201).json({message: 'User Created Successfully!', status: '201', userId: result._id});
        }).catch((error) =>{
            res.status(404).json({
                status: false,
                message: error.message
            })
        })
    })
    
   .catch(err =>{
        res.status(500).json({error: err.message, message: 'Something went wrong!'})
    })

   

}

exports.getUser = async(req, res, next) =>{
    try {
        const user = await UserAuth.find({});
        if(user){
            res.status(200).json({
                status: true,
                user,
                message: "All Users Retrived.."
            })

            io.getIO().emit("get:user", user);
        }
        
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.getUserById = async(req, res, next) =>{
    try {
        const user = await UserAuth.findById(req.params.id);
        if(user){
            res.status(200).json({
                status: true,
                user,
                message: "User Found!.."
            })

            io.getIO().emit("get:user", user);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}

exports.updateUserBalance = async(req, res, next) =>{
    try {
        const user = await UserAuth.findByIdAndUpdate(req.params.id,{
            $inc:{
                balance: req.body.amount
            }
        });
        if(user){
            res.status(200).json({
                status: true,
                user,
                message: "User Updated.."
            })

            io.getIO().emit("get:user", user);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}


exports.updateUser = async(req, res, next) =>{
    try {
        const user = await UserAuth.findByIdAndUpdate(req.params.id, req.body);
        if(user){
            res.status(200).json({
                status: true,
                user,
                message: "User Updated.."
            })

            io.getIO().emit("get:user", user);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}


exports.deleteUser = async(req, res, next) =>{
    try {
        const user = await UserAuth.findByIdAndDelete(req.params.id);
        if(user){
            res.status(200).json({
                status: true,
                user,
                message: "User Deleted.."
            })

            io.getIO().emit("get:user", user);

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            error
        })
    }
}