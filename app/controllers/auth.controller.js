
const { sendIdentNoEmail } = require('./email.controller');
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      nationalityId,
      registrationPurposeId,
      passportIdNumber,
      professionId,
      contactNumber,
      countryName,
      city,
      stateProvince,
      email,
      genderId,
      postalCode,
      fullResidentialAddress,
      acceptTerms,
      userTypeId,
      password,
      roleId,
      statusId,
      roles // Assuming roles can still be passed in
    } = req.body;
 //console.log(req.body);
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({
        message: "First name, last name, email, and password are required!"
      });
    }


    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 8);

    // Generate unique values for fileNo, referenceNo, and identNo
    const generatedFileNo = generateReferenceNo();
    const generatedReferenceNo = generateReferenceNo();
    const generatedIdentNo = generateReferenceNo();

    // Create a new user with the provided fields, including approval default value
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      nationalityId,
      registrationPurposeId,
      passportIdNumber,
      professionId,
      contactNumber,
      countryName,
      city,
      stateProvince,
      email,
      genderId,
      postalCode,
      fullResidentialAddress,
      acceptTerms,
      userTypeId,
      password: hashedPassword, // Use the hashed password
      fileNo: generateReferenceNo(), // Use generated fileNo
      roleId,
      statusId,
      referenceNo: generateReferenceNo(), // Use generated referenceNo
      identNo: generateReferenceNo(), // Use generated identNo
      approval: false // Default approval status
    });
    //console.log(req.body,"eeeeeeeeeeeeeeeeee");
    // Send an email with the identNo after user creation
    await sendIdentNoEmail(email, user.identNo,user.fileNo,user.referenceNo,password);

    // If user creation is successful, send response with the generated fields
    if (user) {
      return res.status(201).send({
        message: "User registered successfully!",
        fileNo: user.fileNo,
        referenceNo: user.referenceNo,
        identNo: user.identNo,
        password:password,
        approval: user.approval // Return approval status
      });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Function to generate a reference number
const generateReferenceNo = () => {
  // Customize your logic for generating reference number
  return `REF-${new Date().getTime()}`;
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        identNo: req.body.identNo,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
// Check if the user is approved
if (!user.approval) {
  return res.status(403).send({ message: "User account is not approved." });
}
    if (!passwordIsValid ) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id },
                           config.secret,
                           {
                            algorithm: 'HS256',
                            allowInsecureKeySizes: true,
                            expiresIn: 86400, // 24 hours
                           });

    // let authorities = [];
    // const roles = await user.getRoles();
    // for (let i = 0; i < roles.length; i++) {
    //   authorities.push("ROLE_" + roles[i].name.toUpperCase());
    // }

    req.session.token = token;

    return res.status(200).send({
      id: user.id,

      identNo: user.identNo,
      roles: user.roleId,
      token:token,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};







