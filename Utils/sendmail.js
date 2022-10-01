const mailer = require('nodemailer');

let transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
    //   type: 'OAuth2',
      user: "mailid@gmail.com",
      pass:"password@",
    //   clientId: process.env.OAUTH_CLIENTID,
    //   clientSecret: process.env.OAUTH_CLIENT_SECRET,
    //   refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

  let mailOptions = {
    from: "developerakshayjadhav@gmail.com",
    to: "developerakshayjadhav@gmail.com",
    subject: 'Hi From Akshay',
    text: 'Hi from your nodemailer project'
  };

  transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });