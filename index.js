const express = require('express');
const multer = require('multer');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const { mongoose } = require('mongoose');

//Routes
const User = require('./Routes/userRoute');
const Service = require('./Routes/serviceRoute');
const Host = require('./Routes/hostRoute');
const Admin = require('./Routes/adminRoute');

//Models
const hostModel = require('./Modals/hostModal');
const userModel = require('./Modals/userModal');

dotenv.config({
  path: "./config.env"
})


const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname.replace(/\\/g, "/"));
  },
});



const app = express();
app.use(
  multer({ storage: diskStorage }).single("file")
);

app.use("/image", express.static(path.join(__dirname, "image")));


app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use(User);
app.use(Service);
app.use(Host);
app.use(Admin);

app.post('/charger', (req,res, next) =>
{
  console.log(res.body);
  req.status(200).json({
    status: true,
    message: "charger started"
  })
})

app.post('/geturl', (req, res, next) =>
{
  if(!req.file){
    res.json({msg: "No file Provided"});
  }
  else{
    const imageUrl = req.file.path.replace(/\\/g, "/");
    res.status(200).json({url:req.protocol + '://' + req.hostname +":" + process.env.PORT + '/' + imageUrl })
  }
})


  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      " GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
  });

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message;
    const data = err.data;

    res.status(status).json({
        message: message,
        data: data,
        error: err,
    });
});






app.all("*", (req, res, next) => {
  res.status(404).json({
      status: false,
      message: "Can't Find the route you are looking for!"
  })
});

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        const server = app.listen(process.env.PORT);
        const io = require("./socket").init(server);
        console.log("Server Started on port:- "+ process.env.PORT);

        io.on("connection", (socket) => {
            console.log("Connected a User");

            socket.on('charger-status',async (value) =>{
              console.log(value);
              let host = await hostModel
                        .findByIdAndUpdate(value['hostId'], {
                             status: (value['status'] == true) ? "available" : "fault"
                                })
              if(host){
                io.emit('charger-status-change', host.status);

              }
            })
            socket.on('charger-start', async (value) =>{
              console.log(value);
              let user = await userModel.findByIdAndUpdate(value['hostid'], {
                $inc:{
                  balance: -25
              }
              })

              io.emit("user-balance", user);
            })

            socket.on('charger-stop', (value) =>{
              console.log(value);
            })

            socket.on("disconnect", () => {
                console.log("User Disconnected");
            });
        });
    })
    .catch((err) => {
        console.log(err);
    });


