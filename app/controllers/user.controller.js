
const { sendApprovalEmail } = require('./email.controller');
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;



exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};




// Update User API
exports.updateUser = async (req, res) => {
  try {
    // Get the identNo from the request body or params
    const { passportIdNumber } = req.params;

    // Find the user by identNo or you can use other unique fields such as 'id' or 'email'
    const user = await User.findOne({
      where: { passportIdNumber: passportIdNumber } // You can modify this to find by email or id
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Update only the fields that are provided in the request body
    const updatedData = {
      firstName: req.body.firstName || user.firstName,
      middleName: req.body.middleName || user.middleName,
      lastName: req.body.lastName || user.lastName,
      nationalityId: req.body.nationalityId || user.nationalityId,
      registrationPurposeId: req.body.registrationPurposeId || user.registrationPurposeId,
      passportIdNumber: req.body.passportIdNumber || user.passportIdNumber,
      professionId: req.body.professionId || user.professionId,
      contactNumber: req.body.contactNumber || user.contactNumber,
      countryName: req.body.countryName || user.countryName,
      city: req.body.city || user.city,
      stateProvince: req.body.stateProvince || user.stateProvince,
      email: req.body.email || user.email,
      genderId: req.body.genderId || user.genderId,
      postalCode: req.body.postalCode || user.postalCode,
      fullResidentialAddress: req.body.fullResidentialAddress || user.fullResidentialAddress,
      acceptTerms: req.body.acceptTerms || user.acceptTerms,
      userTypeId: req.body.userTypeId || user.userTypeId,
      roleId: req.body.roleId || user.roleId,

      statusId: req.body.statusId || user.statusId,
      approval: req.body.approval !== undefined ? req.body.approval : user.approval, // Update approval status if provided
      password: req.body.password ? bcrypt.hashSync(req.body.password, 8) : user.password, // Hash new password if provided
      identNo: user.identNo,
    };

    // Update the user with the new data
    await user.update(updatedData);

    // Send success response with the updated user data
    res.status(200).send({
      message: "User updated successfully!",
      updatedUser: user
    });

  } catch (err) {
    // Handle errors and send response
    res.status(500).send({
      message: "Error updating user.",
      error: err.message
    });
  }
};








// Get all approved users
exports.getApprovedUsers = async (req, res) => {
  try {
    // Find all users where approval is 10 (approved)
    const approvedUsers = await User.findAll({
      where: { approval: 100 } // Filtering based on approval status being 10
    });

    if (!approvedUsers.length) {
      return res.status(404).send({ message: "No approved users found." });
    }

    // Send the response with the list of approved users
    res.status(200).send(approvedUsers);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving approved users.",
      error: err.message
    });
  }
};







// Get all not-approved users
exports.getNotApprovedUsers = async (req, res) => {
  try {
    // Find all users where approval is 0 (not approved)
    const notApprovedUsers = await User.findAll({
      where: { approval: 0 } // Filtering based on approval status being 0
    });

    if (!notApprovedUsers.length) {
      return res.status(404).send({ message: "No not-approved users found." });
    }

    // Send the response with the list of not-approved users
    res.status(200).send(notApprovedUsers);
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving not-approved users.",
      error: err.message
    });
  }
};




// Approve user by updating approval status and storing the approvalUserId
exports.approveUser = async (req, res) => {
  try {
    const { userId, approval, approvalUserId } = req.body; // Extract userId, approval, and approvalUserId from the request body

    // Find the user by ID
    const user = await User.findByPk(userId);

    // If the user does not exist
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Update the approval status and the approvalUserId
    user.approval = approval;
    const temporaryPassword = generateTemporaryPassword();
    user.password = bcrypt.hashSync(temporaryPassword, 8); // Hash the password with a salt

//    user.password = temporaryPassword; // Set the temporary password

    //user.approvalUserId = approvalUserId; // Set the ID of the user approving this account
    await user.save();
    
    await sendApprovalEmail(user.email, user.identNo,user.fileNo,user.referenceNo,temporaryPassword);
    res.status(200).send({ message: "User approval updated successfully.", user });
  } catch (err) {
    res.status(500).send({
      message: "Error updating user approval.",
      error: err.message
    });
  }
};


const generateTemporaryPassword = () => {
  return Math.random().toString(36).slice(-8); // Generates a random 8-character password
};


// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id; // Get user ID from URL parameters

    // Find the user by ID
    const user = await User.findByPk(userId);

    // If the user does not exist
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Delete the user
    await user.destroy();

    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error deleting user.",
      error: err.message
    });
  }
};




exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id; // Extract the user ID from the request parameters
    const user = await User.findByPk(userId); // Fetch user by ID

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user.", error: error.message });
  }
};










exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body; // Extract current and new passwords

    // Find the user by ID from the token
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if the current password is valid
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Current password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = bcrypt.hashSync(newPassword, 8);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send({ message: "Password changed successfully." });
  } catch (err) {
    res.status(500).send({
      message: "Error changing password.",
      error: err.message,
    });
  }
};