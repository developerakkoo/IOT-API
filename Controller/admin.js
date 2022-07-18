const UserAuth = require('./../Modals/adminModal');


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


exports.postSignup = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;
   


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