
const { sendIdentNoEmail } = require('./email.controller');
const db = require("../models");
const config = require("../config/auth.config");
const Compartment = db.Compartment;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


//const User = db.user;
//const Compartment = require('../models/Compartment.model'); // Adjust the path according to your project structure

// const db = require("../models");
// const Compartment = db.Compartment;

// Get all compartments
exports.getAllCompartments = (req, res) => {
  Compartment.findAll()
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Some error occurred while retrieving compartments." }));
};

// Get a specific compartment by ID
exports.getCompartmentById = (req, res) => {
  const id = req.params.id;
  
  Compartment.findByPk(id)
    .then(data => {
      if (data) res.status(200).send(data);
      else res.status(404).send({ message: `Compartment with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({ message: `Error retrieving compartment with id=${id}` }));
};

// Search compartments by name
exports.searchCompartmentsByName = (req, res) => {
  const name = req.params.name;
  
  Compartment.findAll({
    where: {
      name: { [db.Sequelize.Op.like]: `%${name}%` }
    }
  })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: `Error searching compartments by name=${name}` }));
};

// Search compartments by ID
exports.searchCompartmentsById = (req, res) => {
  const id = req.params.id;
  
  Compartment.findByPk(id)
    .then(data => {
      if (data) res.status(200).send(data);
      else res.status(404).send({ message: `Compartment with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({ message: `Error searching compartment by id=${id}` }));
};

// Create a new compartment

// Create a new compartment
// Import the Compartment model (ensure the path is correct)
// const Compartment = require('../models/Compartment');

// Create a new compartment
exports.createCompartment = async (req, res) => {
  try {
    console.log(req.body, "Request body for creating compartment");

    // Get user ID from JWT token, assuming it is stored in req.userId by your JWT middleware
    const createdById = req.userId;

    if (!createdById) {
      return res.status(401).send({ message: "Unauthorized: User ID not found." });
    }

    // Validate required fields
    if (!req.body.name || !req.body.description) {
      return res.status(400).send({ message: "Compartment name and description are required." });
    }

    // Prepare the compartment data
    const compartmentData = {
      name: req.body.name,
      description: req.body.description,
      approved: req.body.approved || 0, // Set approved to false by default
      dateTime: new Date(), // Set current date and time
      referenceNo: req.body.referenceNo || "No Reference", // Default if not provided
      fileNo: req.body.fileNo || "No File Number", // Default if not provided
      compartmentName: req.body.compartmentName || "Unnamed Compartment", // Default if not provided
      allocatedCompartmentOwner: req.body.allocatedCompartmentOwner || "Not Assigned", // Default if not provided
      allocatedLineNo: req.body.allocatedLineNo || "Not Assigned", // Default if not provided
      compartmentLocation: req.body.compartmentLocation || "Unknown", // Default if not provided
      purposeOfCloser: req.body.purposeOfCloser || "None", // Default if not provided
      creationReason: req.body.creationReason || "General", // Default if not provided
      allocatedCountry: req.body.allocatedCountry || "Unknown", // Default if not provided
      allocatedState: req.body.allocatedState || "Unknown", // Default if not provided
      allocatedCity: req.body.allocatedCity || "Unknown", // Default if not provided
      createdByName: req.body.createdByName || "Unknown", // Default if not provided
      vehicleBrandName: req.body.vehicleBrandName || "Unknown", // Default if not provided
      vehicleType: req.body.vehicleType || "Unknown", // Default if not provided
      vehicleModelName: req.body.vehicleModelName || "Unknown", // Default if not provided
      driverName: req.body.driverName || "Unknown", // Default if not provided
      procurement: req.body.procurement || "N/A", // Default if not provided
      approvedByName: req.body.approvedByName || "None", // Default if not provided
      approvedById: req.body.approvedById || null, // Default if not provided
      approvedWithSpecialRemarks: req.body.approvedWithSpecialRemarks || "None", // Default if not provided
      professor: req.body.professor || "N/A", // Default if not provided
      department: req.body.department || "N/A", // Default if not provided
      approvedDateTime: req.body.approvedDateTime || null, // Default if not provided
      validTill: req.body.validTill || null, // Default if not provided
      specialInstructions: req.body.specialInstructions || "None", // Default if not provided
      specialRemarks: req.body.specialRemarks || "None", // Default if not provided
      createdById: createdById, // Set createdById from JWT
      createdAt: new Date(), // Automatically set current date
      updatedAt: new Date() // Automatically set current date
    };

    // Create the compartment in the database
    const compartment = await Compartment.create(compartmentData);

    // Return the created compartment
    res.status(201).send(compartment);
  } catch (err) {
    console.error("Error while creating compartment:", err);

    if (err.name === "SequelizeValidationError") {
      // Handle validation errors from Sequelize
      return res.status(400).send({ message: "Validation Error", errors: err.errors });
    }

    if (err.name === "SequelizeDatabaseError") {
      // Handle database errors
      return res.status(500).send({ message: "Database Error", error: err.message });
    }

    // Catch any other unknown errors
    res.status(500).send({
      message: "Some error occurred while creating the compartment.",
      error: err.message
    });
  }
};












// Edit a compartment by ID (specific edit functionality)
exports.editCompartment = (req, res) => {
  const id = req.params.id;
  
  Compartment.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) res.status(200).send({ message: "Compartment was edited successfully." });
      else res.status(404).send({ message: `Cannot edit compartment with id=${id}. Maybe compartment was not found or req.body is empty!` });
    })
    .catch(err => res.status(500).send({ message: `Error editing compartment with id=${id}` }));
};

// Update a compartment by ID
exports.updateCompartment = (req, res) => {
  const id = req.params.id;
  
  Compartment.update(req.body, { where: { id: id } })
    .then(num => {
      if (num == 1) res.status(200).send({ message: "Compartment was updated successfully." });
      else res.status(404).send({ message: `Cannot update compartment with id=${id}. Maybe compartment was not found or req.body is empty!` });
    })
    .catch(err => res.status(500).send({ message: `Error updating compartment with id=${id}` }));
};

// Delete a compartment by ID
exports.deleteCompartment = (req, res) => {
  const id = req.params.id;
  
  Compartment.destroy({ where: { id: id } })
    .then(num => {
      if (num == 1) res.status(200).send({ message: "Compartment was deleted successfully." });
      else res.status(404).send({ message: `Cannot delete compartment with id=${id}. Maybe compartment was not found!` });
    })
    .catch(err => res.status(500).send({ message: `Could not delete compartment with id=${id}` }));
};

// Approve a compartment
exports.approveCompartment = (req, res) => {
  const id = req.params.id;

  Compartment.update({ approved: 1 }, { where: { id: id } })
    .then(num => {
      if (num == 1) res.status(200).send({ message: "Compartment was approved successfully." });
      else res.status(404).send({ message: `Cannot approve compartment with id=${id}. Maybe compartment was not found!` });
    })
    .catch(err => res.status(500).send({ message: `Could not approve compartment with id=${id}` }));
};

// Get all approved compartments
exports.getApprovedCompartments = (req, res) => {
  Compartment.findAll({ where: { approved: 1 } })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Some error occurred while retrieving approved compartments." }));
};

// Get all not-approved compartments
exports.getNotApprovedCompartments = (req, res) => {
  Compartment.findAll({ where: { approved: 0 } })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: err.message || "Some error occurred while retrieving not-approved compartments." }));
};

// Search approved compartments by name
exports.searchApprovedCompartmentsByName = (req, res) => {
  const name = req.params.name;
  
  Compartment.findAll({
    where: {
      name: { [db.Sequelize.Op.like]: `%${name}%` },
      approved: 1
    }
  })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: `Error searching approved compartments by name=${name}` }));
};

// Search approved compartments by ID
exports.searchApprovedCompartmentsById = (req, res) => {
  const id = req.params.id;

  Compartment.findAll({ where: { id: id, approved: 1 } })
    .then(data => {
      if (data.length > 0) res.status(200).send(data);
      else res.status(404).send({ message: `Approved compartment with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({ message: `Error searching approved compartment by id=${id}` }));
};

// Search not-approved compartments by name
exports.searchNotApprovedCompartmentsByName = (req, res) => {
  const name = req.params.name;
  
  Compartment.findAll({
    where: {
      name: { [db.Sequelize.Op.like]: `%${name}%` },
      approved: 0
    }
  })
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send({ message: `Error searching not-approved compartments by name=${name}` }));
};

// Search not-approved compartments by ID
exports.searchNotApprovedCompartmentsById = (req, res) => {
  const id = req.params.id;

  Compartment.findAll({ where: { id: id, approved: 0 } })
    .then(data => {
      if (data.length > 0) res.status(200).send(data);
      else res.status(404).send({ message: `Not-approved compartment with id=${id} not found.` });
    })
    .catch(err => res.status(500).send({ message: `Error searching not-approved compartment by id=${id}` }));
};



// Approve a compartment by ID
exports.approveCompartment = (req, res) => {
  const id = req.params.id;

  Compartment.update({ approved: 1 }, { where: { id: id } })
    .then(num => {
      if (num == 1) {
        res.status(200).send({ message: "Compartment was approved successfully." });
      } else {
        res.status(404).send({ message: `Cannot approve compartment with id=${id}. Maybe compartment was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: `Could not approve compartment with id=${id}` });
    });
};
