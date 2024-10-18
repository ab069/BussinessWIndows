require('dotenv').config();
const nodemailer = require('nodemailer');

// Create a transport function to send emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "businesswindowsltd@gmail.com", // Use environment variables
    pass: "ybuv frio ntqi jpup"
  }
});

// Function to send email with identNo
const sendIdentNoEmail = async (recipientEmail, identNo, fileNo , referenceNo , password) => {
  try {
    // Define mail options
    const mailOptions = {
      from: "businesswindowsltd@gmail.com", // Sender email address
      to: recipientEmail,           // Recipient email address
      subject: 'Your referenceNo from Our Service',
      text: `Dear user, your fileNo is: ${fileNo}. your referenceNo is: ${referenceNo}.  Please keep it safe for future reference.`
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};



// Function to send email with identNo
const sendApprovalEmail = async (recipientEmail, identNo, fileNo , referenceNo , password) => {
    try {
      // Define mail options
      const mailOptions = {
        from: "businesswindowsltd@gmail.com", // Sender email address
        to: recipientEmail,           // Recipient email address
        subject: 'Your Account Our Service',
        text: `Dear user, your fileNo is: ${fileNo}. your referenceNo is: ${referenceNo}. your IdentNo is: ${identNo}. your password is: ${password}. Your accout is approved plz login Please keep it safe for future reference.`
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
      console.error(`Failed to send email: ${error.message}`);
    }
  };



module.exports = {
  sendIdentNoEmail,sendApprovalEmail
};
