const nodemailer = require("nodemailer");


 const generateOTP= function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


 const  sendOTPEmail=  async function(toEmail, otp) {

  const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER,         
      pass:  process.env.EMAIL_PASS         
    },
  });

  const mailOptions = {
    from: '"Your App Name" <your_email@gmail.com>',
    to: toEmail,
    subject: "Your OTP Code",
    html: `
      <h3>Your OTP Code</h3>
      <p><strong>${otp}</strong></p>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP ${otp} sent to ${toEmail}`);
}

module.exports ={generateOTP,sendOTPEmail};