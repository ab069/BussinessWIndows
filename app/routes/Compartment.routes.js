const { authJwt } = require("../middleware");
const controller = require("../controllers/compartment.controller");
//const controller = require('../controllers/Compartment.controller.js');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // Route to get all compartments (no auth required)
  app.get("/api/compartments", controller.getAllCompartments);

  // Route to get a specific compartment by ID
  app.get("/api/compartments/:id", [authJwt.verifyToken], controller.getCompartmentById);

  // Route to search compartments by name (no auth required)
  app.get("/api/compartments/search/name/:name", controller.searchCompartmentsByName);

  // Route to search compartments by ID
  app.get("/api/compartments/search/id/:id", [authJwt.verifyToken], controller.searchCompartmentsById);

  // Route to create a new compartment
  app.post("/api/compartments", [authJwt.verifyToken, authJwt.isAdmin], controller.createCompartment);

  // Route to update a compartment by ID
  app.put("/api/compartments/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateCompartment);

  // Route to delete a compartment by ID
  app.delete("/api/compartments/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteCompartment);

  // Route to approve a compartment
  app.put("/api/compartments/approve/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.approveCompartment);

  // Route to get all approved compartments
  app.get("/api/compartments/approved", [authJwt.verifyToken], controller.getApprovedCompartments);

  // Route to get all not approved compartments
  app.get("/api/compartments/not-approved", [authJwt.verifyToken], controller.getNotApprovedCompartments);

  // Route to search approved compartments by name
  app.get("/api/compartments/approved/search/name/:name", [authJwt.verifyToken], controller.searchApprovedCompartmentsByName);

  // Route to search approved compartments by ID
  app.get("/api/compartments/approved/search/id/:id", [authJwt.verifyToken], controller.searchApprovedCompartmentsById);

  // Route to search not-approved compartments by name
  app.get("/api/compartments/not-approved/search/name/:name", [authJwt.verifyToken], controller.searchNotApprovedCompartmentsByName);

  // Route to search not-approved compartments by ID
  app.get("/api/compartments/not-approved/search/id/:id", [authJwt.verifyToken], controller.searchNotApprovedCompartmentsById);


  // Approve a compartment by ID
app.put("/api/compartments/approve/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.approveCompartment);

};
