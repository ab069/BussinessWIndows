const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token,
             config.secret,
             (err, decoded) => {
              if (err) {
                return res.status(401).send({
                  message: "Unauthorized!",
                });
              }
              req.userId = decoded.id;
              next();
             });
};










isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
  .then(user => {
    // Check if user is found
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Check if the user has the admin role
    if (user.roleId === 1) { // Assuming 1 is the ID for admin
      next(); // User is an admin, proceed to the next middleware
      return;
    }
    
    res.status(403).send({
      message: "Require Admin Role!"
    });
    return;
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.roleId === 2) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Moderator Role!"
    });
    return;
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.roleId === 1 || user.role === 2) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Admin or Moderator Role!"
    });
    return;
  });
};

isUser = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if (user.roleId === 3) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require User Role!"
    });
    return;
  });
};


const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};
module.exports = authJwt;
