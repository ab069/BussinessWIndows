const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );




 // Route to get all approved users
 app.get("/api/users/approved",[authJwt.verifyToken, authJwt.isAdmin], controller.getApprovedUsers);

 // Route to get all not approved users
 app.get("/api/users/not-approved",[authJwt.verifyToken, authJwt.isAdmin], controller.getNotApprovedUsers);

 // Route to update a user's details
 app.put("/api/users/update/:id",[authJwt.verifyToken, authJwt.isAdmin], controller.updateUser); // Update user by ID


 // Route to approve a user
app.put("/api/users/approve", [authJwt.verifyToken, authJwt.isAdmin], controller.approveUser);
// Route to delete a user by ID
app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);

// Route to change the user's password
app.put("/api/users/change-password", [authJwt.verifyToken], controller.changePassword);

};
